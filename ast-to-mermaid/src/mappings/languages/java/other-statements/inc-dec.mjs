import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map increment/decrement statement to Mermaid flowchart nodes
 * Creates process node for increment/decrement operation
 * @param {Object} node - Normalized increment/decrement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIncDecStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for increment/decrement
  const incDecId = ctx.next();
  const incDecText = node.text || "inc/dec";
  ctx.add(incDecId, processShape(incDecText));
  
  // Connect to previous node and set as last
  // Check if we're in a branch context and handle connection appropriately
  if (ctx.currentIf && ctx.currentIf() && ctx.currentIf().activeBranch) {
    // We're inside a conditional branch, use branch connection logic
    ctx.handleBranchConnection(incDecId);
  } else {
    // Not in a branch, use normal sequential connection
    linkNext(ctx, incDecId);
  }
}