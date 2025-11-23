/**
 * Normalize C++ AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizeCpp(node) {
  if (!node) return null;
  
  // Convert C++-specific AST nodes to unified node types
  switch (node.type) {
    case "translation_unit":
      // Only process the main function from the translation unit
      const mainFunction = node.children ? node.children.find(child => {
        if (child.type === 'function_definition') {
          const functionDeclarator = child.child(1);
          if (functionDeclarator && functionDeclarator.type === 'function_declarator') {
            const functionName = functionDeclarator.child(0)?.text;
            return functionName === 'main';
          }
        }
        return false;
      }) : null;
      
      if (mainFunction) {
        return normalizeCpp(mainFunction);
      }
      
      return {
        type: "Program",
        name: "main",
        body: []
      };
      
    case "function_definition":
      // Process the body of the main function
      const functionDeclarator = node.child(1);
      if (functionDeclarator && functionDeclarator.type === 'function_declarator') {
        const functionName = functionDeclarator.child(0)?.text;
        if (functionName === 'main') {
          // Get the compound statement (body) of the main function
          const bodyNode = node.child(2); // This should be the compound_statement
          const normalizedBody = bodyNode ? normalizeCpp(bodyNode) : null;
          return {
            type: "Program",
            name: "main",
            body: normalizedBody ? normalizedBody.body || [] : []
          };
        }
      }
      // Ignore other function definitions - they're boilerplate
      return null;
      
    case "compound_statement":
      // Handle compound statements (blocks with { })
      return {
        type: "Block",
        body: node.children
          .slice(1, -1) // Remove opening and closing braces
          .map(normalizeCpp)
          .filter(Boolean)
      };
      
    case "if_statement":
      // Handle if statements with proper else clause processing
      const condition = normalizeCpp(node.child(1)); // condition is typically at index 1 (after 'if')
      const thenBlock = normalizeCpp(node.child(2)); // then block is typically at index 2
      
      // Check for else clause (typically at index 3 in C++)
      let elseBlock = null;
      const elseClause = node.child(3);
      if (elseClause && elseClause.type === 'else_clause') {
        // The else clause contains the actual else statement
        // In C++, "else if" is parsed as "else" + "if_statement"
        elseBlock = normalizeCpp(elseClause.child(1)); // Typically the statement after 'else'
      }
      
      return {
        type: "If",
        cond: condition,
        then: thenBlock,
        else: elseBlock
      };
      
    case "for_statement":
      return {
        type: "For",
        init: normalizeCpp(node.child(2)), // init is typically at index 2
        cond: normalizeCpp(node.child(4)), // condition is typically at index 4
        update: normalizeCpp(node.child(6)), // update is typically at index 6
        body: normalizeCpp(node.child(8)) // body is typically at index 8
      };
      
    case "while_statement":
      return {
        type: "While",
        cond: normalizeCpp(node.child(1)), // condition is typically at index 1
        body: normalizeCpp(node.child(2)) // body is typically at index 2
      };
      
    case "expression_statement":
      return normalizeCpp(node.child(0)); // Process the actual expression
      
    case "assignment_expression":
      return {
        type: "Assign",
        text: node.text
      };
      
    case "declaration":
      // Process declarations - they are executable statements
      // Even declarations without initialization are executable statements
      return {
        type: "Decl",
        text: node.text
      };
      
    case "class_specifier":
      // Ignore class definitions - they're boilerplate
      return null;
      
    case "namespace_definition":
      // Ignore namespace definitions - they're boilerplate
      return null;
      
    case "new_expression":
      // Handle C++ new operations (dynamic memory allocation)
      return {
        type: "New",
        text: node.text
      };
      
    case "delete_expression":
      // Handle C++ delete operations (dynamic memory deallocation)
      return {
        type: "Delete",
        text: node.text
      };
      
    case "try_statement":
      // Handle C++ try blocks
      return {
        type: "Try",
        text: node.text,
        body: node.child(1) ? normalizeCpp(node.child(1)) : null,  // try block body
        catch: node.child(2) ? normalizeCpp(node.child(2)) : null   // catch clause
      };
      
    case "catch_clause":
      // Handle C++ catch clauses
      return {
        type: "Catch",
        text: node.text,
        parameter: node.child(1)?.text || null,  // catch parameter
        body: node.child(2) ? normalizeCpp(node.child(2)) : null  // catch block body
      };
      
    case "throw_statement":
      // Handle C++ throw statements
      return {
        type: "Throw",
        text: node.text
      };
      
    case "switch_statement":
      // Handle switch statements
      return {
        type: "Switch",
        cond: normalizeCpp(node.child(1)), // condition is typically at index 1 (condition_clause)
        body: normalizeCpp(node.child(2)) // body is typically at index 2 (compound_statement)
      };
      
    case "case_statement":
      // Handle case statements (including default cases)
      // Check if this is actually a default case
      if (node.child(0)?.type === 'default') {
        // This is a default case
        return {
          type: "Default",
          body: node.children ? node.children.slice(2).map(normalizeCpp).filter(Boolean) : [] // Skip default and : tokens
        };
      } else {
        // This is a regular case
        return {
          type: "Case",
          value: node.child(1)?.text, // value is typically at index 1
          body: node.children ? node.children.slice(3).map(normalizeCpp).filter(Boolean) : [] // Skip case, value, and : tokens
        };
      }
      
    case "default":
      // Handle standalone default nodes (shouldn't occur in switch statements)
      return {
        type: "Default",
        body: []
      };
      
    case "break_statement":
      // Handle break statements
      return {
        type: "Break",
        text: "break"
      };
      
    case "call_expression":
      // Handle cout statements
      if (node.text && node.text.includes('cout')) {
        return {
          type: "IO",
          text: node.text
        };
      }
      return {
        type: "Expr",
        text: node.text
      };
      
    case "binary_expression":
      // Handle cout/cin statements (C++ stream operations use << or >> operators)
      if (node.text && (node.text.includes('cout') || node.text.includes('cin'))) {
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
      
    case "preproc_include":
      // Ignore #include directives - they're boilerplate
      return null;
      
    case "using_declaration":
      // Ignore using namespace statements - they're boilerplate
      return null;
      
    case "function_declarator":
      // Ignore function declarations - they're boilerplate
      return null;
      
    case "primitive_type":
      // Ignore primitive types when they appear as standalone nodes
      return null;
      
    case "comment":
      // Ignore comments - they shouldn't appear in flowcharts
      return null;
      
    default:
      // For simple nodes with text, convert to expression
      if (node.text) {
        return {
          type: "Expr",
          text: node.text
        };
      }
      return null;
  }
}