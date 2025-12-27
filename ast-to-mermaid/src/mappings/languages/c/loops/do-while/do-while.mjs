/**
 * Do-while loop mapping for C language
 */

import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map do-while loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized do-while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDoWhileLoop(node, ctx) {
  if (!node || !ctx) return;
  
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
  
  // Create the condition node
  const doWhileId = ctx.next();
  const doWhileText = `while (${conditionText})`;
  ctx.add(doWhileId, decisionShape(doWhileText));
  
  // Store loop information for later completion by the walker
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'do-while',
    loopId: doWhileId,
    text: doWhileText
  });
}