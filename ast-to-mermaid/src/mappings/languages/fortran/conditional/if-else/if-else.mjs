import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../../c/mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map if-else statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches for if-else
 * @param {Object} node - Normalized if-else statement node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapIfElse(node, ctx, mapper) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const conditionId = ctx.next();
  
  // For Fortran, we need to distinguish between standalone if-else and else-if chains
  const currentIf = ctx.currentIf && typeof ctx.currentIf === 'function' ? ctx.currentIf() : null;
  const isElseIf = currentIf && currentIf.activeBranch === 'else';
  const prefix = isElseIf ? 'else if ' : 'if ';
  
  // Remove parentheses from condition text
  let conditionText = node.cond?.text || "condition";
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }
  
  // Add prefix to show if/else if
  const labelText = prefix + conditionText;
  ctx.add(conditionId, decisionShape(labelText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, conditionId);
  
  // Register if context for branch handling
  if (typeof ctx.registerIf === 'function') {
    ctx.registerIf(conditionId, !!node.else);
  }
  
  // The walker will handle branch processing separately
}

