import { shapes } from "../mermaid/shapes.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map repeat-until loop to Mermaid flowchart nodes
 * Creates decision node for loop condition similar to C do-while implementation
 * @param {Object} node - Normalized repeat-until loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapRepeatUntil(node, ctx) {
  if (!node || !ctx) return;
  
  // Store the previous context to connect to the loop body later
  const nodeBeforeCondition = ctx.last;
  
  // Create decision node for condition
  const repeatUntilId = ctx.next();
  let conditionText = 'condition';
  if (node.untilCondition?.text) {
    conditionText = node.untilCondition.text;
  } else if (node.cond?.text) {
    conditionText = node.cond.text;
  }
  const repeatUntilText = `until ${conditionText}`;
  ctx.add(repeatUntilId, decisionShape(repeatUntilText));
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'repeat-until',
    loopId: repeatUntilId,
    nodeBeforeCondition: nodeBeforeCondition  // Store for later use in walker
  });
  
  // Don't call linkNext for repeat-until - the connection logic is handled specially in the walker
  // Just set as last node for tracking
  ctx.last = repeatUntilId;
}