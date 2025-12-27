import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map if-else statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches for if-else statements
 * @param {Object} node - Normalized if-else statement node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Function to map child nodes
 */
export function mapIfElseStatement(node, ctx, mapper) {
  if (!node || !ctx || !mapper) return;

  // Create decision node for condition
  const conditionId = ctx.next();

  // Remove parentheses from condition text
  let conditionText = node.cond?.text || "condition";
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }

  // Add prefix to show if
  const labelText = 'if ' + conditionText;
  ctx.add(conditionId, decisionShape(labelText));

  // Connect to previous node using shared linking logic
  linkNext(ctx, conditionId);

  // Register if context for branch handling
  const hasElse = !!node.else;
  if (typeof ctx.registerIf === 'function') {
    ctx.registerIf(conditionId, hasElse);
  }

  // Enter the then branch
  if (typeof ctx.enterBranch === 'function') {
    ctx.enterBranch('then');
  }

  // Process the then statement
  if (node.then && mapper) {
    if (node.then.type === 'Block' && node.then.body) {
      // Process block body
      if (Array.isArray(node.then.body)) {
        node.then.body.forEach(child => {
          if (child && mapper) {
            mapper(child, ctx);
          }
        });
      } else {
        // If body is not an array, map it directly
        mapper(node.then.body, ctx);
      }
    } else {
      // If it's not a block, map the then statement directly
      mapper(node.then, ctx);
    }
  }

  // Exit the then branch
  if (typeof ctx.exitBranch === 'function') {
    ctx.exitBranch('then');
  }

  // Handle the else branch if it exists
  if (node.else) {
    // Enter the else branch
    if (typeof ctx.enterBranch === 'function') {
      ctx.enterBranch('else');
    }

    // Process the else statement
    if (node.else && mapper) {
      if (node.else.type === 'Block' && node.else.body) {
        // Process block body
        if (Array.isArray(node.else.body)) {
          node.else.body.forEach(child => {
            if (child && mapper) {
              mapper(child, ctx);
            }
          });
        } else {
          // If body is not an array, map it directly
          mapper(node.else.body, ctx);
        }
      } else {
        // If it's not a block, map the else statement directly
        mapper(node.else, ctx);
      }
    }

    // Exit the else branch
    if (typeof ctx.exitBranch === 'function') {
      ctx.exitBranch('else');
    }
  }

  // Complete the if statement and handle branch merging
  if (typeof ctx.completeIf === 'function') {
    ctx.completeIf();
  }
}