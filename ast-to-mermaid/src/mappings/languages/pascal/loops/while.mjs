import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map while loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhile(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire while loop
  const whileId = ctx.next();
  // Combine condition into a single text
  const whileText = `while (${node.cond?.text || ""})`;
  ctx.add(whileId, decisionShape(whileText));
  
  // Connect to previous node
  if (ctx.last) {
    ctx.addEdge(ctx.last, whileId, "Yes");
  }
  
  // Set the while loop node as the last node
  ctx.last = whileId;
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'while',
    loopId: whileId
  });
}