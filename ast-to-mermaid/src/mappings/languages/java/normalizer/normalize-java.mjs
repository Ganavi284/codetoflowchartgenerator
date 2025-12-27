/**
 * Normalize Java AST to unified node types
 * @param {Object} ast - Tree-sitter AST
 * @returns {Object} - Normalized AST
 */
export function normalizeJava(ast) {
  if (!ast) return null;
  
  // If this is a tree-sitter tree, get the root node
  const rootNode = ast.rootNode ? ast.rootNode : ast;

  // Collect functions (including main) and any top-level executable statements
  if (rootNode.type === 'program') {
    const functions = [];
    const topLevelStatements = [];

    for (let i = 0; i < rootNode.childCount; i++) {
      const child = rootNode.child(i);
      if (!child) continue;

      if (child.type === 'class_declaration') {
        const normalizedFns = normalizeClassDeclaration(child);
        if (normalizedFns && normalizedFns.length) {
          functions.push(...normalizedFns);
        }
      } else if (child.type !== '{' && child.type !== '}') {
        const normalized = normalizeNode(child);
        if (normalized) {
          topLevelStatements.push(normalized);
        }
      }
    }

    if (functions.length || topLevelStatements.length) {
      return {
        type: 'Program',
        body: [...functions, ...topLevelStatements]
      };
    }
  }
  
  // Fallback
  return normalizeNode(rootNode);
}

/**
 * Safely get a child node by field name
 * @param {Object} node - Tree-sitter node
 * @param {string} fieldName - Field name
 * @returns {Object|null} - Child node or null
 */
function safeChildForFieldName(node, fieldName) {
  if (!node || typeof node.childForFieldName !== 'function') {
    return null;
  }
  return node.childForFieldName(fieldName);
}

/**
 * Normalize a class declaration by extracting method declarations as Function nodes
 * @param {Object} classNode - Tree-sitter class_declaration node
 * @returns {Array} - Array of normalized Function nodes
 */
function normalizeClassDeclaration(classNode) {
  const result = [];
  if (!classNode) return result;

  // Safely get class body
  let classBody = null;
  if (typeof classNode.childForFieldName === 'function') {
    classBody = classNode.childForFieldName('body');
  } else {
    for (let j = 0; j < classNode.childCount; j++) {
      const grandChild = classNode.child(j);
      if (grandChild && grandChild.type === 'class_body') {
        classBody = grandChild;
        break;
      }
    }
  }

  if (!classBody || classBody.type !== 'class_body') return result;

  for (let j = 0; j < classBody.childCount; j++) {
    const member = classBody.child(j);
    if (member && member.type === 'method_declaration') {
      const fn = normalizeMethodDeclaration(member);
      if (fn) result.push(fn);
    }
  }

  return result;
}

/**
 * Normalize a method_declaration to a unified Function node
 * @param {Object} member - method_declaration node
 * @returns {Object|null} - Normalized Function node
 */
function normalizeMethodDeclaration(member) {
  if (!member) return null;

  let methodName = null;
  if (typeof member.childForFieldName === 'function') {
    const nameNode = member.childForFieldName('name');
    if (nameNode) methodName = nameNode.text;
  } else {
    for (let k = 0; k < member.childCount; k++) {
      const nameChild = member.child(k);
      if (nameChild && nameChild.type === 'identifier') {
        methodName = nameChild.text;
        break;
      }
    }
  }

  let methodBody = null;
  if (typeof member.childForFieldName === 'function') {
    methodBody = member.childForFieldName('body');
  } else {
    for (let k = 0; k < member.childCount; k++) {
      const bodyChild = member.child(k);
      if (bodyChild && bodyChild.type === 'block') {
        methodBody = bodyChild;
        break;
      }
    }
  }

  const statements = [];
  if (methodBody && methodBody.type === 'block') {
    for (let k = 0; k < methodBody.childCount; k++) {
      const stmt = methodBody.child(k);
      if (stmt && stmt.type !== '{' && stmt.type !== '}') {
        const normalized = normalizeNode(stmt);
        if (normalized) {
          statements.push(normalized);
        }
      }
    }
  }

  return {
    type: 'Function',
    name: methodName || 'anonymous',
    body: statements,
    params: [], // Params not used in flow mapping; can extend later
    text: methodName ? `function ${methodName}` : 'function'
  };
}

/**
 * Normalize individual Java nodes
 * @param {Object} node - Tree-sitter node
 * @returns {Object} - Normalized node
 */
function normalizeNode(node) {
  if (!node) return null;
  
  switch (node.type) {
    case 'local_variable_declaration':
      // Handle variable declarations with initialization
      if (node.childCount > 0) {
        // Find the variable declarator
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'variable_declarator') {
            // Safely get name and value
            let name = null;
            let value = null;
            
            // Iterate through children of the variable_declarator
            for (let j = 0; j < child.childCount; j++) {
              const grandChild = child.child(j);
              if (grandChild && grandChild.type === 'identifier') {
                name = grandChild.text;
              } else if (grandChild && grandChild.type !== '=' && grandChild.type !== ';' && 
                         grandChild.type !== 'identifier') {
                value = grandChild;
              }
            }
            
            if (name) {
              // If there's a value, create an assignment expression
              if (value) {
                const normalizedValue = normalizeNode(value);
                // Add descriptive text for common cases
                let text = null;
                if (normalizedValue && normalizedValue.type === 'ExpressionStatement' && 
                    normalizedValue.expression && normalizedValue.expression.type === 'Literal') {
                  if (normalizedValue.expression.value && normalizedValue.expression.value.includes('Scanner')) {
                    text = `${name} = new Scanner(System.in)`;
                  } else {
                    text = `${name} = ${normalizedValue.expression.value}`;
                  }
                } else if (normalizedValue && normalizedValue.type === 'CallExpression') {
                  // Handle method calls in assignments
                  text = `${name} = ${normalizedValue.text}`;
                }
                
                return {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: name },
                  right: normalizedValue,
                  operator: '=',
                  text: text || node.text  // Use node.text as fallback
                };
              } else {
                // If no value, create a declaration (we'll process this as an assignment with user input)
                return {
                  type: 'AssignmentExpression',
                  left: { type: 'Identifier', name: name },
                  right: { type: 'Identifier', name: 'input' },
                  operator: '=',
                  text: `${name} = input` || node.text  // Use node.text as fallback
                };
              }
            }
          }
        }
      }
      return {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: node.text, raw: node.text },
        text: node.text  // Return the full declaration text
      };
      
    case 'assignment_expression':
      let left = null;
      let right = null;
      let operator = '=';
      
      if (typeof node.childForFieldName === 'function') {
        left = normalizeNode(safeChildForFieldName(node, 'left'));
        right = normalizeNode(safeChildForFieldName(node, 'right'));
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type !== '=') {
            if (!left) {
              left = normalizeNode(child);
            } else {
              right = normalizeNode(child);
            }
          } else if (child && child.type === '=') {
            operator = child.text;
          }
        }
      }
      
      return {
        type: 'AssignmentExpression',
        left: left,
        right: right,
        operator: operator,
        text: node.text  // Add the original text for display purposes
      };
      
    case 'binary_expression':
      let binLeft = null;
      let binRight = null;
      let binOperator = '';
      
      if (typeof node.childForFieldName === 'function') {
        binLeft = normalizeNode(safeChildForFieldName(node, 'left'));
        binRight = normalizeNode(safeChildForFieldName(node, 'right'));
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type !== '+' && child.type !== '-' && 
              child.type !== '*' && child.type !== '/' && 
              child.type !== '>' && child.type !== '<' &&
              child.type !== '>=' && child.type !== '<=' &&
              child.type !== '==' && child.type !== '!=') {
            if (!binLeft) {
              binLeft = normalizeNode(child);
            } else {
              binRight = normalizeNode(child);
            }
          } else if (child) {
            binOperator = child.text;
          }
        }
      }
      
      return {
        type: 'BinaryExpression',
        left: binLeft,
        right: binRight,
        operator: binOperator,
        text: node.text  // Use the original text which contains the full expression
      };
      
    case 'if_statement':
      let test = null;
      let consequent = null;
      let alternate = null;
      
      if (typeof node.childForFieldName === 'function') {
        test = normalizeNode(safeChildForFieldName(node, 'condition'));
        consequent = normalizeNode(safeChildForFieldName(node, 'consequence'));
        alternate = safeChildForFieldName(node, 'alternative') ? 
                   normalizeNode(safeChildForFieldName(node, 'alternative')) : null;
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'parenthesized_expression') {
            // Condition is in parentheses
            test = normalizeNode(child.firstNamedChild);
          } else if (child && child.type === 'block' && !consequent) {
            consequent = normalizeNode(child);
          } else if (child && child.type === 'if_statement') {
            // Else if
            alternate = normalizeNode(child);
          } else if (child && child.type === 'block' && consequent) {
            // Else block
            alternate = normalizeNode(child);
          } else if (child && child.type === 'expression_statement' && !consequent) {
            // Single-line if statement
            consequent = {
              type: 'BlockStatement',
              body: [normalizeNode(child)]
            };
          } else if (child && child.type === 'expression_statement' && consequent && !alternate) {
            // Single-line else statement
            alternate = {
              type: 'BlockStatement',
              body: [normalizeNode(child)]
            };
          }
        }
      }
      
      // Extract the condition text more specifically
      let conditionText = null;
      if (test && test.text) {
        conditionText = test.text;
      } else {
        // Extract condition from the original node text by finding what's between parentheses after 'if'
        const match = node.text.match(/if\s*\(([^)]+)\)/);
        if (match && match[1]) {
          conditionText = match[1].trim();
        } else {
          conditionText = node.text;
        }
      }
      
      return {
        type: 'IfStatement',
        test: test,
        consequent: consequent,
        alternate: alternate,
        text: conditionText  // Use the extracted condition text
      };
      
    case 'switch_expression':
      let discriminant = null;
      const cases = [];
      
      if (typeof node.childForFieldName === 'function') {
        discriminant = normalizeNode(safeChildForFieldName(node, 'condition'));
        const body = safeChildForFieldName(node, 'body');
        if (body && body.type === 'switch_block') {
          // Process switch block to extract cases and their statements
          // The switch block contains switch_block_statement_group nodes
          for (let i = 0; i < body.childCount; i++) {
            const child = body.child(i);
            if (child.type === 'switch_block_statement_group') {
              // Process the switch block statement group which contains both label and statements
              const normalizedCase = normalizeNode(child);
              if (normalizedCase) {
                cases.push(normalizedCase);
              }
            }
          }
        }
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'parenthesized_expression') {
            // Condition is in parentheses
            discriminant = normalizeNode(child.firstNamedChild);
          } else if (child && child.type === 'switch_block') {
            // Process switch block to extract cases and their statements
            for (let j = 0; j < child.childCount; j++) {
              const blockChild = child.child(j);
              if (blockChild.type === 'switch_block_statement_group') {
                // Process the switch block statement group which contains both label and statements
                const normalizedCase = normalizeNode(blockChild);
                if (normalizedCase) {
                  cases.push(normalizedCase);
                }
              }
            }
          }
        }
      }
      
      return {
        type: 'SwitchStatement',
        discriminant: discriminant,
        cases: cases
      };
      
    case 'switch_label':
      // Check if this is a default case
      let isDefault = false;
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type === 'default') {
          isDefault = true;
          break;
        }
      }
      
      if (isDefault) {
        return {
          type: 'SwitchCase',
          test: null
        };
      } else {
        // Find the case value
        let caseValue = null;
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'case') {
            // Get the expression after 'case'
            const expr = node.child(i + 1);
            if (expr) {
              caseValue = normalizeNode(expr);
              break;
            }
          }
        }
        
        return {
          type: 'SwitchCase',
          test: caseValue
        };
      }
      
    case 'switch_block_statement_group':
      // This node contains both switch labels and statements
      // Process switch label and its associated statements
      let currentCase = null;
      
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type === 'switch_label') {
          // Process switch label
          const normalizedLabel = normalizeNode(child);
          if (normalizedLabel) {
            currentCase = normalizedLabel;
          }
        } else if (child && child.type !== '{' && child.type !== '}' && child.type !== ':') {
          // This is a statement that belongs to the current case
          if (currentCase) {
            if (!currentCase.consequent) {
              currentCase.consequent = [];
            }
            const normalizedStmt = normalizeNode(child);
            if (normalizedStmt) {
              currentCase.consequent.push(normalizedStmt);
            }
          }
        }
      }
      
      return currentCase;
      
    case 'for_statement':
      let init = null;
      let condition = null;
      let update = null;
      let forBody = null;
      
      if (typeof node.childForFieldName === 'function') {
        init = normalizeNode(safeChildForFieldName(node, 'initializer'));
        condition = normalizeNode(safeChildForFieldName(node, 'condition'));
        update = normalizeNode(safeChildForFieldName(node, 'update'));
        forBody = normalizeNode(safeChildForFieldName(node, 'body'));
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'local_variable_declaration') {
            init = normalizeNode(child);
          } else if (child && child.type === 'assignment_expression') {
            // Handle assignment expressions in for loop initialization
            init = normalizeNode(child);
          } else if (child && child.type === 'identifier') {
            // Handle identifier in initialization
            init = normalizeNode(child);
          } else if (child && child.type === 'binary_expression') {
            condition = normalizeNode(child);
          } else if (child && child.type === 'update_expression') {
            update = normalizeNode(child);
          } else if (child && child.type === 'block') {
            forBody = normalizeNode(child);
          }
        }
      }
      
      // If init is still null, try to extract it from the full node text
      if (!init && node.text) {
        const match = node.text.match(/for\s*\(([^;]*);[^;]*;[^;]*\)/);
        if (match && match[1]) {
          init = { type: 'ExpressionStatement', expression: { type: 'Literal', value: match[1].trim(), raw: match[1].trim() }, text: match[1].trim() };
        }
      }
      
      return {
        type: 'ForStatement',
        init: init,
        test: condition,
        update: update,
        body: forBody
      };
      
    case 'while_statement':
      let whileTest = null;
      let whileBody = null;
      
      if (typeof node.childForFieldName === 'function') {
        whileTest = normalizeNode(safeChildForFieldName(node, 'condition'));
        whileBody = normalizeNode(safeChildForFieldName(node, 'body'));
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'parenthesized_expression') {
            whileTest = normalizeNode(child.firstNamedChild);
          } else if (child && child.type === 'block') {
            whileBody = normalizeNode(child);
          }
        }
      }
      
      return {
        type: 'WhileStatement',
        test: whileTest,
        body: whileBody
      };
      
    case 'do_statement':
      let doTest = null;
      let doBody = null;
      
      if (typeof node.childForFieldName === 'function') {
        doTest = normalizeNode(safeChildForFieldName(node, 'condition'));
        doBody = normalizeNode(safeChildForFieldName(node, 'body'));
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'block') {
            doBody = normalizeNode(child);
          } else if (child && child.type === 'parenthesized_expression') {
            doTest = normalizeNode(child.firstNamedChild);
          }
        }
      }
      
      return {
        type: 'DoWhileStatement',
        test: doTest,
        body: doBody
      };
      
    case 'break_statement':
      return {
        type: 'BreakStatement'
      };
      
    case 'continue_statement':
      return {
        type: 'ContinueStatement'
      };
      
    case 'return_statement':
      let argument = null;
      if (typeof node.childForFieldName === 'function') {
        const valueNode = safeChildForFieldName(node, 'value');
        if (valueNode) {
          argument = normalizeNode(valueNode);
        }
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type !== 'return') {
            argument = normalizeNode(child);
            break;
          }
        }
      }
      
      return {
        type: 'ReturnStatement',
        argument: argument,
        text: node.text  // Preserve the original text
      };
      
    case 'expression_statement':
      // Try to get the expression from the first named child
      const expressionNode = node.firstNamedChild;
      if (expressionNode) {
        const normalizedExpression = normalizeNode(expressionNode);
        return {
          type: 'ExpressionStatement',
          expression: normalizedExpression,
          text: node.text  // Include the original text
        };
      }
      // Fallback: try to iterate through children
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type !== ';') {
          const normalizedExpression = normalizeNode(child);
          if (normalizedExpression) {
            return {
              type: 'ExpressionStatement',
              expression: normalizedExpression,
              text: node.text  // Include the original text
            };
          }
        }
      }
      // If no expression found, return with text
      return {
        type: 'ExpressionStatement',
        expression: { type: 'Literal', value: node.text, raw: node.text },
        text: node.text
      };
      
    case 'update_expression':
      return {
        type: 'UpdateExpression',
        operator: node.child(0).type === '++' || node.child(0).type === '--' ? 
                 node.child(0).text : node.child(1).text,
        argument: normalizeNode(node.childForFieldName ? 
                               node.childForFieldName('argument') : 
                               (node.firstNamedChild || node.lastNamedChild)),
        prefix: node.child(0).type === '++' || node.child(0).type === '--',
        text: node.text  // Include the original text
      };
      
    case 'method_invocation':
      // Handle System.out.println calls and Scanner input calls
      let object = null;
      let name = null;
      let args = [];
      
      if (typeof node.childForFieldName === 'function') {
        const objectNode = safeChildForFieldName(node, 'object');
        const nameNode = safeChildForFieldName(node, 'name');
        if (objectNode) object = objectNode.text;
        if (nameNode) name = nameNode.text;
        
        const argsNode = safeChildForFieldName(node, 'arguments');
        if (argsNode) {
          args = Array.from(argsNode.children)
                  .filter(child => child.type !== '(' && child.type !== ')' && child.type !== ',')
                  .map(normalizeNode);
        }
      } else {
        // Fallback: iterate through children
        for (let i = 0; i < node.childCount; i++) {
          const child = node.child(i);
          if (child && child.type === 'identifier') {
            // First identifier is the object, second is the method name
            if (!object) {
              object = child.text;
            } else if (!name) {
              name = child.text;
            }
          } else if (child && child.type === 'field_access') {
            object = child.text;
          } else if (child && child.type === 'argument_list') {
            args = Array.from(child.children)
                    .filter(c => c.type !== '(' && c.type !== ')' && c.type !== ',')
                    .map(normalizeNode);
          }
        }
      }
      
      // If we didn't find a name but have an object, the object might be the name (for direct method calls)
      if (!name && object) {
        name = object;
        object = null;
      }
      
      if (name) {
        // Handle System.out.println/printf calls
        if (object && object.includes('System.out') && 
            (name === 'println' || name === 'print' || name === 'printf')) {
          // Create the full System.out.println text
          let printText = `System.out.${name}(${args.map(arg => {
            if (arg && arg.type === 'Literal') {
              return arg.value;
            } else if (arg && arg.type === 'Identifier') {
              return arg.name;
            } else {
              return "expression";
            }
          }).join(", ")})`;
          
          return {
            type: 'CallExpression',
            callee: {
              object: { name: 'System' },
              property: { name: 'out' }
            },
            arguments: args,
            text: printText
          };
        }
        
        // Handle Scanner input calls (when object is a variable like 'sc')
        if (name === 'nextInt' || name === 'nextDouble' || name === 'next') {
          // Check if this is a method call on a Scanner variable
          if (object) {
            return {
              type: 'CallExpression',
              callee: {
                object: { name: object },
                property: { name: name }
              },
              arguments: args,
              text: `read ${name.replace('next', '').toLowerCase()}`
            };
          } else {
            // Handle direct method calls
            return {
              type: 'CallExpression',
              callee: {
                object: { name: 'input' },
                property: { name: name }
              },
              arguments: args,
              text: `read ${name.replace('next', '').toLowerCase()}`
            };
          }
        }
        
        // Handle general method calls
        return {
          type: 'CallExpression',
          callee: {
            name: name
          },
          arguments: args,
          text: `${name}(${args.map(arg => {
            if (arg && arg.type === 'Literal') {
              return arg.value;
            } else if (arg && arg.type === 'Identifier') {
              return arg.name;
            } else {
              return "...";
            }
          }).join(", ")})`
        };
      }
      return null;
      
    case 'identifier':
      return {
        type: 'Identifier',
        name: node.text
      };
      
    case 'decimal_integer_literal':
      return {
        type: 'Literal',
        value: parseInt(node.text),
        raw: node.text
      };
      
    case 'string_literal':
      // Remove quotes
      const value = node.text.substring(1, node.text.length - 1);
      return {
        type: 'Literal',
        value: value,
        raw: node.text
      };
      
    case 'block':
      const blockStatements = [];
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type !== '{' && child.type !== '}') {
          const normalized = normalizeNode(child);
          if (normalized) {
            blockStatements.push(normalized);
          }
        }
      }
      return {
        type: 'BlockStatement',
        body: blockStatements
      };
      
    default:
      // For unhandled node types, try to extract text representation
      if (node.text) {
        return {
          type: 'ExpressionStatement',
          expression: {
            type: 'Literal',
            value: node.text,
            raw: node.text
          }
        };
      }
      return null;
  }
}