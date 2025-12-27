import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map while loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhile(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const whileId = ctx.next();
  
  // Extract the condition text
  let conditionText = "condition";
  if (node.test) {
    if (typeof node.test === 'string') {
      conditionText = node.test;
    } else if (node.test.text) {
      conditionText = node.test.text;
    } else {
      conditionText = "condition";
    }
  }
  
  // Format the condition properly for display
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }
  
  const whileText = `while (${conditionText})`;
  ctx.add(whileId, decisionShape(whileText));
  
  // Connect to previous node and set as last
  linkNext(ctx, whileId);
  
  // Register as a conditional node similar to if statements
  // This allows the context to handle Yes/No branches properly
  if (typeof ctx.registerIf === 'function') {
    ctx.registerIf(whileId, false); // while loops don't have an else part
  }
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'while',
    loopId: whileId
  });
}