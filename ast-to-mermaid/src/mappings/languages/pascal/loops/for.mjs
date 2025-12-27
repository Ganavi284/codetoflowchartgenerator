import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates proper loop structure with initialization, condition, body, and increment
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create initialization node
  const initId = ctx.next();
  let initText = 'init';
  if (node.init?.text) {
    // Extract the initialization part (e.g., from "i := 1 to 5" extract "i := 1")
    const match = node.init.text.match(/^(\w+)\s*:=?\s*(.+?)\s+(to|downto)\s+.+$/);
    if (match) {
      initText = `${match[1]} := ${match[2]}`;
    } else {
      initText = node.init.text;
    }
  }
  ctx.add(initId, processShape(initText));
  
  // Connect initialization to condition check
  linkNext(ctx, initId);
  
  // Create condition check node
  const condId = ctx.next();
  const condText = node.cond?.text || 'condition';
  ctx.add(condId, decisionShape(condText));
  
  // Add edge from init to condition
  ctx.addEdge(initId, condId);
  
  // Register this as a loop condition to handle branching properly
  // We need to set up the condition to handle "Yes" (enter body) and "No" (exit loop) branches
  if (typeof ctx.registerLoopCondition === 'function') {
    ctx.registerLoopCondition(condId, 'for');
  }
  
  // Store loop information for later completion by the walker
  // We'll store the condition ID so that when the walker completes the loop,
  // it knows which condition node to connect the "No" branch to END
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'for',
    loopId: condId,
    initId: initId,
    incrementId: null // Will be set when we create the increment node
  });
  
  // Store the condition ID so the walker can reference it when processing the body and increment
  ctx.currentLoopCondId = condId;
  ctx.currentLoopInitId = initId;
}