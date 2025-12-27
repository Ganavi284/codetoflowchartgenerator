/**
 * Normalize Python AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizePython(node) {
  if (!node) return null;
  
  // Convert Python-specific AST nodes to unified node types
  switch (node.type) {
    case "module":
      return {
        type: "Program",
        name: "main",
        body: node.children ? node.children.map(normalizePython).filter(Boolean) : []
      };
      
    case "function_definition":
      // Check if this is the main function
      const functionName = node.child(1)?.text || "unknown";
      if (functionName === "main") {
        // Get the block (body) of the function
        const bodyNode = node.child(4); // This should be the block
        return {
          type: "Program",
          name: "main",
          body: bodyNode ? (normalizePython(bodyNode)?.body || []) : []
        };
      }
      // Extract the function body (typically at index 4 in tree-sitter-python)
      let functionBody = [];
      for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type === 'block') {
          const normalizedBody = normalizePython(child);
          if (normalizedBody && normalizedBody.body) {
            functionBody = normalizedBody.body;
          }
          break;
        }
      }
      return {
        type: "Function",
        name: functionName,
        body: functionBody
      };
      
    case "block":
      // This is a block - process its children
      return {
        type: "Block",
        body: node.children ? node.children.map(normalizePython).filter(Boolean) : []
      };
      
    case "if_statement":
      // Handle if/elif/else chains properly
      const result = {
        type: "If",
        cond: normalizePython(node.child(1)), // condition is typically at index 1 (after 'if')
        then: normalizePython(node.child(3)), // then block is typically at index 3
        else: null
      };
      
      // Process elif and else clauses
      // In tree-sitter-python, elif clauses and else clauses are separate child nodes
      // We need to chain them properly: if -> elif -> elif -> else
      let currentIf = result;
      
      // Process all children starting from index 4
      for (let i = 4; i < node.childCount; i++) {
        const child = node.child(i);
        if (child && child.type === 'elif_clause') {
          // Convert elif to nested if structure
          const elifCond = normalizePython(child.child(1)); // condition after 'elif'
          const elifBody = normalizePython(child.child(3)); // body after ':'
          
          // Create a new if statement for the elif
          const elifIf = {
            type: "If",
            cond: elifCond,
            then: elifBody,
            else: null
          };
          
          // Attach this elif if to the current else chain
          currentIf.else = elifIf;
          currentIf = elifIf;
        } else if (child && child.type === 'else_clause') {
          // Handle else clause - this is the final else
          currentIf.else = normalizePython(child.child(2)); // body after 'else' and ':'
        }
      }
      
      return result;
      
    case "for_statement":
      return {
        type: "For",
        target: normalizePython(node.child(1)), // target is at index 1 (identifier)
        iter: normalizePython(node.child(3)), // iterator is at index 3 (call)
        body: normalizePython(node.child(5)) // body is at index 5 (block)
      };
      
    case "while_statement":
      return {
        type: "While",
        cond: normalizePython(node.child(1)), // condition is typically at index 1
        body: normalizePython(node.child(3)) // body is typically at index 3
      };
      
    case "expression_statement":
      // Process the actual expression, which might contain function calls
      const expr = normalizePython(node.child(0));
      
      // Check if this expression contains a function call
      if (expr && expr.text) {
        const funcCall = extractFunctionCallFromAssignment(expr.text);
        if (funcCall) {
          // Handle function calls inside expressions like print(function_call())
          // Don't override IO type if it's an I/O operation, but still track the inner function call
          if (expr.type === 'IO') {
            // Create a special node that tracks both the IO operation and the function call
            return {
              ...expr,
              innerFunctionCall: funcCall
            };
          } else if (funcCall.name) {
            // Return as a function call if it's not an IO operation
            return {
              type: "FunctionCall",
              name: funcCall.name,
              arguments: [], // Arguments are part of the text
              text: funcCall.text
            };
          }
        }
      }
      return expr;
      
    case "assignment":
      // Check if this assignment contains an I/O operation
      if (node.text && containsIOOperation(node.text)) {
        return {
          type: "IO",
          text: node.text
        };
      }
      // Check if this assignment contains a function call
      const funcCall = extractFunctionCallFromAssignment(node.text);
      if (funcCall) {
        return {
          type: "Assign",
          text: node.text,
          functionCall: funcCall
        };
      }
      return {
        type: "Assign",
        text: node.text
      };
      
    case "call":
      // Handle print, input, and other I/O functions
      if (node.text && containsIOOperation(node.text)) {
        // Check if this I/O operation contains an inner function call
        const funcCall = extractFunctionCallFromAssignment(node.text);
        if (funcCall) {
          return {
            type: "IO",
            text: node.text,
            innerFunctionCall: funcCall
          };
        } else {
          return {
            type: "IO",
            text: node.text
          };
        }
      }
      // Handle function calls
      const callName = extractFunctionName(node);
      return {
        type: "FunctionCall",
        name: callName,
        arguments: extractFunctionArguments(node),
        text: node.text
      };
      
    case "match_statement":
      // Handle Python match (switch) statements
      // console.log('Processing match_statement:', node.text);
      // console.log('Children count:', node.childCount);
      
      // Log all children to understand the structure
      // for (let i = 0; i < node.childCount; i++) {
      //   const child = node.child(i);
      //   if (child) {
      //     console.log(`  Child ${i}: ${child.type} = "${child.text}"`);
      //   }
      // }
      
      const matchCases = [];
      
      // Cases are inside the block child (index 3)
      const blockChild = node.child(3);
      if (blockChild && blockChild.type === 'block') {
        // console.log('Processing block child with', blockChild.childCount, 'children');
        for (let i = 0; i < blockChild.childCount; i++) {
          const caseChild = blockChild.child(i);
          if (caseChild && caseChild.type === 'case_clause') {
            const normalizedCase = normalizePython(caseChild);
            // console.log('Normalized case:', JSON.stringify(normalizedCase, null, 2));
            matchCases.push(normalizedCase);
          }
        }
      }
      
      const matchResult = {
        type: "Match",
        subject: normalizePython(node.child(1)), // subject is typically at index 1 (after 'match')
        cases: matchCases
      };
      
      // console.log('Final match result:', JSON.stringify(matchResult, null, 2));
      return matchResult;
      
    case "case_clause":
      // Handle individual case clauses in match statements
      // console.log('Processing case_clause:', node.text);
      // console.log('Children count:', node.childCount);
      
      // Log all children to understand the structure
      // for (let i = 0; i < node.childCount; i++) {
      //   const child = node.child(i);
      //   if (child) {
      //     console.log(`  Child ${i}: ${child.type} = "${child.text}"`);
      //   }
      // }
      
      return {
        type: "Case",
        pattern: normalizePython(node.child(1)), // pattern is typically at index 1 (after 'case')
        body: normalizePython(node.child(3)) // body is typically at index 3 (after ':')
      };
      
    case "return_statement":
      return {
        type: "Return",
        text: node.text
      };
      
    case "comment":
      // Skip comments - they should be ignored
      return null;
      
    case "import_statement":
      // Skip import statements - they should be ignored
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

// Helper function to check if a text contains I/O operations
function containsIOOperation(text) {
  // List of common Python I/O functions - more specific to actual I/O
  const ioFunctions = [
    'print', 'input', 'open', 'read', 'write', 'close',
    'readline', 'readlines', 'writelines', 'seek', 'tell', 'flush',
    'raw_input', 'sys.stdout', 'sys.stdin', 'sys.stderr', 'print_function',
    'input_file', 'output_file', 'file_input', 'file_output'
  ];
  
  // Check if any I/O function appears in the text
  return ioFunctions.some(ioFunc => {
    // Use word boundary to avoid partial matches (e.g., "append" shouldn't match "append")
    // Look for the function name followed by parentheses or dot notation
    const regex = new RegExp(`\\b${ioFunc}\\s*[.(]`, 'i');
    return regex.test(text);
  });
}

// Helper function to extract function name from call node
function extractFunctionName(node) {
  if (node.child(0)) {
    // For simple function calls like func()
    return node.child(0).text || 'unknown';
  }
  return 'unknown';
}

// Helper function to extract function arguments
function extractFunctionArguments(node) {
  // Arguments are typically in the parentheses child
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (child && child.type === 'argument_list') {
      const args = [];
      for (let j = 0; j < child.childCount; j++) {
        const arg = child.child(j);
        if (arg && arg.type !== 'comma') {
          args.push(arg.text);
        }
      }
      return args;
    }
  }
  return [];
}

// Helper function to extract function call information from assignment text
function extractFunctionCallFromAssignment(text) {
  if (!text) return null;
  
  // Look for patterns like function_name(...) in the text
  // This regex looks for function calls with arguments in parentheses
  const funcCallRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/g;
  const matches = [...text.matchAll(funcCallRegex)];
  
  // Look for the rightmost (innermost) function call that isn't print, input, etc.
  // This handles nested calls like print(even_or_odd(7))
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    const fullMatch = match[0];
    const functionName = match[1];
    
    // Skip common I/O functions as they are handled separately
    const ioFunctions = ['print', 'input', 'open', 'len', 'str', 'int', 'float', 'range'];
    if (!ioFunctions.includes(functionName)) {
      return {
        name: functionName,
        text: fullMatch
      };
    }
  }
  
  return null;
}