import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper to create decision shape
const decisionShape = (text) => shapes.decision.replace("{}", text);

/**
 * Map Java do-while loop to Mermaid flowchart nodes
 * Uses a decision node for the loop condition, like C/C++ do-while.
 * @param {Object} node - Normalized DoWhileStatement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDoWhileStatement(node, ctx) {
  if (!node || !ctx) return;

  // Get condition text from various sources
  let condText = "condition";
  
  // First try to get from node.test.text
  if (node.test?.text) {
    condText = node.test.text;
  }
  // Then try from node.text
  else if (node.text) {
    condText = node.text;
  }
  // Then try from node.test.expression.value (for ExpressionStatement with Literal)
  else if (node.test?.expression?.value) {
    condText = node.test.expression.value;
  }
  
  // Remove parentheses if present
  if (condText.startsWith('(') && condText.endsWith(')')) {
    condText = condText.substring(1, condText.length - 1);
  }
  
  const doWhileText = `while (${condText})`;
  
  // Store the original last node to connect the condition properly later
  const originalLast = ctx.last;
  
  // Create the condition node but don't connect it to the flow yet
  const doWhileId = ctx.next();
  ctx.add(doWhileId, decisionShape(doWhileText));

  // Store loop information for later connection
  ctx.currentLoop = {
    conditionId: doWhileId,
    type: "do-while"
  };
  
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: "do-while",
    loopId: doWhileId,
    originalLast: originalLast
  });
  
  // For do-while, don't change the ctx.last so the flow continues to the body
  // The connection to the condition will be handled by completeLoop
}