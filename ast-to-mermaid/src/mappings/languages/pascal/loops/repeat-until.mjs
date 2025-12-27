import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map repeat-until loop to Mermaid flowchart nodes
 * Creates proper repeat-until loop structure: body executes first, then condition check
 * @param {Object} node - Normalized repeat-until loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapRepeatUntil(node, ctx) {
  if (!node || !ctx) return;
  
  // Store current last node to connect after the loop
  const originalLast = ctx.last;
  
  // Create the condition check node (the until part) but don't connect it yet
  const conditionId = ctx.next();
  let conditionText = 'condition';
  if (node.untilCondition?.text) {
    conditionText = node.untilCondition.text;
  } else if (node.cond?.text) {
    conditionText = node.cond.text;
  }
  ctx.add(conditionId, decisionShape(`until ${conditionText}`));
  
  // Register this as a loop condition to handle branching properly
  if (typeof ctx.registerLoopCondition === 'function') {
    ctx.registerLoopCondition(conditionId, 'repeat-until');
  }
  
  // Store the condition ID so the walker can reference it when processing the body
  ctx.currentLoopCondId = conditionId;
  
  // Process the loop body (execute before condition check)
  if (node.body) {
    ctx.inLoop = true;
    
    // Process the body using the walker
    if (typeof ctx.handle === 'function') {
      ctx.handle(node.body);
    }
    
    ctx.inLoop = false;
  }
  
  // Connect the last node of the body to the condition check
  if (ctx.last) {
    ctx.addEdge(ctx.last, conditionId);
  }
  
  // The structure should be: body -> condition -> (if condition is false, loop back to body)
  // In Mermaid, this means: condition -- No --> body start, condition -- Yes --> exit loop
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'repeat-until',
    loopId: conditionId,
    conditionId: conditionId,
    originalLast: originalLast
  });
  
  // Set the last node to the condition so the "No" branch can connect properly
  ctx.last = conditionId;
}