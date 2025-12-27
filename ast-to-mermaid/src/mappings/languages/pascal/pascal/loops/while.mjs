import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map while loop to Mermaid flowchart nodes
 * Creates proper while loop structure: condition check first, then body if condition is true
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhile(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the condition
  const whileId = ctx.next();
  const whileText = `while ${node.cond?.text || "condition"}`;
  ctx.add(whileId, decisionShape(whileText));
  
  // Connect to previous node and set as last
  linkNext(ctx, whileId);
  
  // Register this as a loop condition to handle branching properly
  if (typeof ctx.registerLoopCondition === 'function') {
    ctx.registerLoopCondition(whileId, 'while');
  }
  
  // Store the condition ID so the walker can reference it when processing the body
  ctx.currentLoopCondId = whileId;
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'while',
    loopId: whileId
  });
  
  // Set the last node to the condition so the "Yes" branch can connect to body
  ctx.last = whileId;
}