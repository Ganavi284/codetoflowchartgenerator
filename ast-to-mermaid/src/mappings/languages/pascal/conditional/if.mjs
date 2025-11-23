import { shapes } from "../mermaid/shapes.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map if statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches
 * @param {Object} node - Normalized if statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIf(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const conditionId = ctx.next();
  // Remove parentheses from condition text
  let conditionText = node.cond?.text || "condition";
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }
  ctx.add(conditionId, decisionShape(conditionText));
  
  // Connect to previous node
  if (ctx.last) {
    ctx.addEdge(ctx.last, conditionId, "Yes");
  }
  
  // Store the condition node ID for later branch connections
  ctx.ifConditionId = conditionId;
  ctx.thenBranchConnected = false;
  ctx.elseBranchConnected = false;
  ctx.hasElseBranch = !!node.else;
  
  // Set the condition node as the last node
  ctx.last = conditionId;
}