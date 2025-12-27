import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map return statement to Mermaid flowchart nodes
 * Creates a process node for return statements
 * @param {Object} node - Normalized return statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapReturn(node, ctx) {
  if (!node || !ctx) return;
  
  // Create return node
  const returnId = ctx.next();
  const returnText = `return ${node.value || ""}`;
  ctx.add(returnId, processShape(returnText));
  
  // Connect to previous node
  // If we're in a loop, use the loop body connection method
  if (ctx.inLoop && typeof ctx.handleLoopBodyConnection === 'function') {
    ctx.handleLoopBodyConnection(returnId);
  } else if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
    ctx.handleBranchConnection(returnId);
  } else {
    linkNext(ctx, returnId);
  }
}