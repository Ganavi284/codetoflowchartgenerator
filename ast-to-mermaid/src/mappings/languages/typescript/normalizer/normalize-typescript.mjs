/**
 * Normalize TypeScript AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizeTypescriptAst(node) {
  if (!node) return null;
  
  // Convert TypeScript-specific AST nodes to unified node types
  switch (node.type) {
    case "program":
      return {
        type: "Program",
        name: "main",
        body: node.children ? node.children.map(normalizeTypescriptAst).filter(Boolean) : []
      };
      
    case "function_declaration":
      // Check if this is the main function
      const functionName = node.child(1)?.text || "unknown";
      return {
        type: "Function",
        name: functionName,
        body: node.children ? node.children.map(normalizeTypescriptAst).filter(Boolean) : []
      };
      
    case "block":
      // This is a block - process its children
      return {
        type: "Block",
        body: node.children ? node.children.map(normalizeTypescriptAst).filter(Boolean) : []
      };
      
    case "if_statement":
      return {
        type: "If",
        cond: normalizeTypescriptAst(node.child(1)), // condition is typically at index 1 (after 'if')
        then: normalizeTypescriptAst(node.child(3)), // then block is typically at index 3
        else: node.child(5) ? normalizeTypescriptAst(node.child(5)) : null // else block is typically at index 5
      };
      
    case "for_statement":
      return {
        type: "For",
        init: normalizeTypescriptAst(node.child(1)), // init is typically at index 1
        cond: normalizeTypescriptAst(node.child(3)), // condition is typically at index 3
        update: normalizeTypescriptAst(node.child(5)), // update is typically at index 5
        body: normalizeTypescriptAst(node.child(7)) // body is typically at index 7
      };
      
    case "while_statement":
      return {
        type: "While",
        cond: normalizeTypescriptAst(node.child(1)), // condition is typically at index 1
        body: normalizeTypescriptAst(node.child(3)) // body is typically at index 3
      };
      
    case "expression_statement":
      return normalizeTypescriptAst(node.child(0)); // Process the actual expression
      
    case "assignment_expression":
      return {
        type: "Assign",
        text: node.text
      };
      
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