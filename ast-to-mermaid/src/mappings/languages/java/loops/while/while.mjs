import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper to create decision shape
const decisionShape = (text) => shapes.decision.replace("{}", text);

/**
 * Map Java while-loop to Mermaid flowchart nodes
 * Uses a decision node for the loop condition, like C/C++.
 * @param {Object} node - Normalized WhileStatement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapWhileStatement(node, ctx) {
  if (!node || !ctx) return;

  const conditionId = ctx.next();
  // Get condition text from various sources
  let condText = "condition";
  
  // First try to get from node.text
  if (node.text) {
    condText = node.text;
  }
  // Then try from node.test.text
  else if (node.test?.text) {
    condText = node.test.text;
  }
  // Then try from node.test.expression.value (for ExpressionStatement with Literal)
  else if (node.test?.expression?.value) {
    condText = node.test.expression.value;
  }
  
  // Remove parentheses if present
  if (condText.startsWith('(') && condText.endsWith(')')) {
    condText = condText.substring(1, condText.length - 1);
  }
  
  const whileText = `while (${condText})`;
  ctx.add(conditionId, decisionShape(whileText));

  // Connect to previous node (no label needed for entry to loop condition)
  if (ctx.last) {
    ctx.addEdge(ctx.last, conditionId);
  } else {
    // If no previous node, just set as start
    ctx.last = conditionId;
  }

  // Store loop information for connection handling
  ctx.currentLoop = {
    conditionId: conditionId,
    type: "while"
  };
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'while',
    loopId: conditionId
  });
}