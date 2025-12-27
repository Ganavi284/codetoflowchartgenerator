import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map if-else statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches
 * @param {Object} node - Normalized if-else statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIfElseStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const conditionId = ctx.next();
  
  // Remove parentheses from condition text
  let conditionText = node.cond?.text || "condition";
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }
  
  // Add prefix to show if/else if
  const labelText = 'if ' + conditionText;
  ctx.add(conditionId, decisionShape(labelText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, conditionId);
  
  // Register if context for branch handling
  // For if-else statements, hasElse should be true
  if (typeof ctx.registerIf === 'function') {
    ctx.registerIf(conditionId, true);
  }
  
  // Set the condition node as the last node
  ctx.last = conditionId;
}