import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapForStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  // Handle the case where init already contains a semicolon
  let initText = node.init?.text || "";
  if (initText.endsWith(';')) {
    initText = initText.slice(0, -1); // Remove trailing semicolon
  }
  const forText = `for (${initText}; ${node.test?.text || ""}; ${node.update?.text || ""})`;
  ctx.add(forId, decisionShape(forText));
  
  // Connect to previous node (no label needed for entry to loop condition)
  if (ctx.last) {
    ctx.addEdge(ctx.last, forId);
  } else {
    // If no previous node, just set as start
    ctx.last = forId;
  }
  
  // Set current loop for proper connection handling
  ctx.currentLoop = {
    conditionId: forId,
    type: 'for',
    loopId: forId
  };
  
  // Process function calls in the condition expression without creating separate nodes
  if (node.test && node.test.functionCalls && Array.isArray(node.test.functionCalls)) {
    node.test.functionCalls.forEach(funcName => {
      if (!ctx.functionCalls) {
        ctx.functionCalls = [];
      }
      ctx.functionCalls.push({
        callId: forId,
        functionName: funcName
      });
    });
  }
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'for',
    loopId: forId
  });
}