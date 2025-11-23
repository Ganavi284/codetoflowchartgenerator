/**
 * Normalize Pascal AST to unified node types
 * @param {Object} node - AST node
 * @returns {Object} - Normalized node
 */
export function normalizePascal(node) {
  if (!node) return null;
  
  // Convert Pascal-specific AST nodes to unified node types
  switch (node.type) {
    case "Program":
      return {
        type: "Program",
        name: "main",
        body: node.body ? node.body.map(normalizePascal).filter(Boolean) : []
      };
      
    case "IfStatement":
      return {
        type: "If",
        cond: normalizePascal(node.test),
        then: normalizePascal(node.consequent),
        else: node.alternate ? normalizePascal(node.alternate) : null
      };
      
    case "ForStatement":
      return {
        type: "For",
        init: normalizePascal(node.init),
        cond: normalizePascal(node.test),
        update: normalizePascal(node.update),
        body: normalizePascal(node.body)
      };
      
    case "WhileStatement":
      return {
        type: "While",
        cond: normalizePascal(node.test),
        body: normalizePascal(node.body)
      };
      
    case "CallExpression":
      // Handle writeln statements
      if (node.text && node.text.startsWith('writeln')) {
        return {
          type: "IO",
          text: node.text.replace('writeln', 'printf')
        };
      }
      return {
        type: "Expr",
        text: node.text
      };
      
    case "AssignmentExpression":
      return {
        type: "Assign",
        text: node.text.replace(':=', '=')
      };
      
    case "VariableDeclaration":
      return {
        type: "Decl",
        text: node.text
      };
      
    case "BlockStatement":
      return {
        type: "Block",
        body: node.body ? node.body.map(normalizePascal).filter(Boolean) : []
      };
      
    case "ExpressionStatement":
      return normalizePascal(node.expression);
      
    case "BinaryExpression":
      return {
        type: "Expr",
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