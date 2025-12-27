import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to generate text representation of a node
function generateNodeText(node) {
  if (!node) return "expression";
  
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'Identifier':
      return node.name;
    case 'BinaryExpression':
      const leftText = generateNodeText(node.left);
      const rightText = generateNodeText(node.right);
      // For string concatenation
      if (node.operator === '+') {
        return `${leftText}${rightText}`;
      }
      return `${leftText} ${node.operator} ${rightText}`;
    default:
      return node.text || "expression";
  }
}

// Helper function to create return shape with text
const returnShape = (text) => shapes.return.replace('{}', text);

/**
 * Map return statement to Mermaid flowchart nodes
 * Creates return node for return statements
 * @param {Object} node - Normalized return statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapReturn(node, ctx) {
  if (!node || !ctx) return;
  
  // Create return node
  const returnId = ctx.next();
  
  // Generate appropriate text for the return statement
  let returnText = "return";
  if (node.text) {
    // If full text is available (from normalizer), use it
    returnText = node.text;
  } else if (node.argument) {
    // If there is a return value, include it in the text
    const returnArgText = generateNodeText(node.argument);
    returnText = `return ${returnArgText}`;
  } else if (node.expression) {
    // Try to get return value from expression property
    const returnArgText = generateNodeText(node.expression);
    returnText = `return ${returnArgText}`;
  } else {
    returnText = "return";
  }
  
  ctx.add(returnId, returnShape(returnText));
  
  // Connect to previous node and set as last
  // Check if we're in a branch context and handle connection appropriately
  if (ctx.currentIf && ctx.currentIf() && ctx.currentIf().activeBranch) {
    // We're inside a conditional branch, use branch connection logic
    ctx.handleBranchConnection(returnId);
  } else {
    // Not in a branch, use normal sequential connection
    linkNext(ctx, returnId);
  }
}