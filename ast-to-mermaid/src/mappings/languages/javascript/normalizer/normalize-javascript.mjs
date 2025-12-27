/**
 * Normalize JavaScript AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizeJavaScript(node) {
  if (!node) return null;
  
  // Convert JavaScript-specific AST nodes to unified node types
  switch (node.type) {
    case "program":
      return {
        type: "Program",
        name: "main",
        body: node.children ? node.children.map(normalizeJavaScript).filter(Boolean) : []
      };
      
    case "function_declaration":
      // Check if this is the main function
      const functionName = node.child(1)?.text || "unknown";
      if (functionName === "main") {
        // Get the block (body) of the function
        const bodyNode = node.child(3); // This should be the block
        return {
          type: "Program",
          name: "main",
          body: bodyNode ? normalizeJavaScript(bodyNode).body || [] : []
        };
      }
      // Handle user-defined function declarations
      const funcName = node.child(1)?.text || "unknown";
      const funcBodyNode = node.children ? node.children.find(child => child.type === 'statement_block') : null;
      return {
        type: "Function",
        name: funcName,
        body: funcBodyNode ? normalizeJavaScript(funcBodyNode).body || [] : [],
        text: `function ${funcName}`
      };
      
    case "statement_block":
      // This is a block {} - process its children
      return {
        type: "Block",
        body: node.children ? node.children.slice(1, -1).map(normalizeJavaScript).filter(Boolean) : [] // Remove { and }
      };
      
    case "if_statement":
      // Handle if-else-if chains properly
      let alternate = null;
      // Check if there's an else clause (typically at index 3 in 0-indexed array)
      if (node.child(3)) {
        alternate = normalizeJavaScript(node.child(3));
      }
      
      return {
        type: "If",
        test: normalizeJavaScript(node.child(1)), // condition is at index 1 (the parenthesized expression)
        consequent: normalizeJavaScript(node.child(2)), // then block is at index 2
        alternate: alternate
      };
      
    case "for_statement":
      // For a for loop: for (init; test; update) body
      // Children are: [for, (, init, test, ;, update, ), body]
      return {
        type: "For",
        init: normalizeJavaScript(node.child(2)), // init is at index 2
        test: normalizeJavaScript(node.child(3)), // test is at index 3
        update: normalizeJavaScript(node.child(5)), // update is at index 5
        body: normalizeJavaScript(node.child(7)) // body is at index 7
      };
      
    case "while_statement":
      // For a while loop: while (condition) body
      // Children are: [while, parenthesized_expression, body]
      return {
        type: "While",
        test: node.child(1) ? normalizeJavaScript(node.child(1)) : null, // condition in parenthesized expression
        body: normalizeJavaScript(node.child(2)) // body is at index 2
      };
      
    case "do_statement":
      // For a do-while loop: do body while (condition) ;
      // Children are: [do, body, while, parenthesized_expression, ;]
      return {
        type: "DoWhile",
        body: normalizeJavaScript(node.child(1)), // body is at index 1
        test: node.child(3) ? normalizeJavaScript(node.child(3)) : null // condition in parenthesized expression
      };
      
    case "switch_statement":
      // The switch_body is typically at index 2
      const switchBody = node.child(2);
      const cases = [];
      
      // Extract cases from switch_body children
      if (switchBody && switchBody.children) {
        // Skip the first '{' and last '}' tokens
        for (let i = 1; i < switchBody.children.length - 1; i++) {
          const child = switchBody.children[i];
          const normalized = normalizeJavaScript(child);
          if (normalized) {
            cases.push(normalized);
          }
        }
      }
      
      return {
        type: "Switch",
        discriminant: normalizeJavaScript(node.child(1)), // switch expression is typically at index 1
        cases: cases
      };
      
    case "switch_case":
      return {
        type: "Case",
        test: normalizeJavaScript(node.child(1)), // case value is typically at index 1
        consequent: node.children ? node.children.slice(3).map(normalizeJavaScript).filter(Boolean) : [] // Skip 'case', value, and ':'
      };
      
    case "switch_default":
      return {
        type: "Default",
        consequent: node.children ? node.children.slice(2).map(normalizeJavaScript).filter(Boolean) : [] // Skip 'default' and ':'
      };
      
    case "expression_statement":
      return normalizeJavaScript(node.child(0)); // Process the actual expression
      
    case "assignment_expression":
      // Check if this assignment contains a function call
      if (node.children) {
        // Look for call expressions in the assignment
        for (const child of node.children) {
          if (child.type === 'call_expression') {
            // This assignment contains a function call
            return {
              type: "FunctionCall",
              text: node.text,
              callee: normalizeJavaScript(child)
            };
          }
        }
      }
      return {
        type: "Assign",
        text: node.text
      };
      
    case "lexical_declaration":
    case "variable_declaration":
      // Check if this is a variable declaration with initialization
      // Skip variable declarations without values
      if (node.text && node.text.includes('=')) {
        // Check if this declaration contains a function call
        // We need to look through the children of variable_declarator for call expressions
        if (node.children) {
          for (const child of node.children) {
            if (child.type === 'variable_declarator') {
              // Look for call expressions in the variable_declarator's children
              if (child.children) {
                for (const declaratorChild of child.children) {
                  if (declaratorChild.type === 'call_expression') {
                    // Found a function call in the variable declarator
                    return {
                      type: "FunctionCall",
                      text: node.text,
                      callee: normalizeJavaScript(declaratorChild)
                    };
                  } else if (declaratorChild.type === 'assignment_expression') {
                    // Check the assignment expression for call expressions
                    if (declaratorChild.children) {
                      for (const assignChild of declaratorChild.children) {
                        if (assignChild.type === 'call_expression') {
                          // This declaration contains a function call
                          return {
                            type: "FunctionCall",
                            text: node.text,
                            callee: normalizeJavaScript(assignChild)
                          };
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return {
          type: "Decl",
          text: node.text
        };
      }
      // Skip variable declarations without initialization
      return null;
      
    case "import_statement":
    case "import_clause":
      // Skip import statements - they should be ignored
      return null;
      
    case "export_statement":
      // Skip export statements - they should be ignored
      return null;
      
    case "class_declaration":
      // Skip class declarations - they should be ignored
      return null;
      
    case "else_clause":
      // Process the statement that follows 'else'
      // This could be a single statement or another if_statement
      if (node.children && node.children.length > 1) {
        // The actual statement is typically at index 1
        return normalizeJavaScript(node.children[1]);
      }
      return null;
      
    case "call_expression":
      // Handle console.log statements
      if (node.text && node.text.includes('console.log')) {
        return {
          type: "IO",
          text: node.text
        };
      }
      return {
        type: "Expr",
        text: node.text
      };
      
    case "return_statement":
      return {
        type: "Return",
        text: node.text
      };
      
    case "break_statement":
      return {
        type: "Break",
        text: node.text
      };
      
    default:
      // For simple nodes with text, convert to expression
      // But skip comments and directives
      if (node.text) {
        // Skip comments
        if (node.type === "comment") {
          return null;
        }
        
        // Skip directives like "use strict"
        if (node.text.trim() === '"use strict";' || node.text.trim() === "'use strict';") {
          return null;
        }
        
        // Skip empty statements
        if (node.text.trim() === ';') {
          return null;
        }
        
        return {
          type: "Expr",
          text: node.text
        };
      }
      return null;
  }
}