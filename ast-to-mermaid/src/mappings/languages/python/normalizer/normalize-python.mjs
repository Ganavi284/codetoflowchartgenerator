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
          body: bodyNode ? normalizePython(bodyNode).body || [] : []
        };
      }
      return {
        type: "Function",
        name: functionName,
        body: node.children ? node.children.map(normalizePython).filter(Boolean) : []
      };
      
    case "block":
      // This is a block - process its children
      return {
        type: "Block",
        body: node.children ? node.children.map(normalizePython).filter(Boolean) : []
      };
      
    case "if_statement":
      return {
        type: "If",
        cond: normalizePython(node.child(1)), // condition is typically at index 1 (after 'if')
        then: normalizePython(node.child(3)), // then block is typically at index 3
        else: node.child(5) ? normalizePython(node.child(5)) : null // else block is typically at index 5
      };
      
    case "for_statement":
      return {
        type: "For",
        init: null, // Python for loops don't have traditional init
        cond: normalizePython(node.child(3)), // condition is typically at index 3
        update: null, // Python for loops don't have traditional update
        body: normalizePython(node.child(5)) // body is typically at index 5
      };
      
    case "while_statement":
      return {
        type: "While",
        cond: normalizePython(node.child(1)), // condition is typically at index 1
        body: normalizePython(node.child(3)) // body is typically at index 3
      };
      
    case "expression_statement":
      return normalizePython(node.child(0)); // Process the actual expression
      
    case "assignment":
      return {
        type: "Assign",
        text: node.text
      };
      
    case "call":
      // Handle print statements
      if (node.text && node.text.includes('print')) {
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