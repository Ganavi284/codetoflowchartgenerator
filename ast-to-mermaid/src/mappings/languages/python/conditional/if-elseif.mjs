import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map if-elif-else statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches for if-elif-else chains
 * @param {Object} node - Normalized if-elif-else statement node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Function to map child nodes
 */
export function mapIfElifElseStatement(node, ctx, mapper) {
  if (!node || !ctx || !mapper) return;

  // Process the if-elif-else chain iteratively to avoid recursion issues
  let currentNode = node;
  let previousConditionId = null;
  
  while (currentNode) {
    // Create decision node for condition
    const conditionId = ctx.next();

    // Determine if this is an "if" or "elif" statement
    const currentIf = ctx.currentIf && typeof ctx.currentIf === 'function' ? ctx.currentIf() : null;
    const isElif = currentIf && currentIf.activeBranch === 'else';
    const prefix = isElif ? 'elif ' : 'if ';

    // Remove parentheses from condition text
    let conditionText = currentNode.cond?.text || "condition";
    if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
      conditionText = conditionText.substring(1, conditionText.length - 1);
    }

    // Add prefix to show if/elif
    const labelText = prefix + conditionText;
    ctx.add(conditionId, decisionShape(labelText));

    // Connect to previous node or to previous condition in chain
    if (previousConditionId) {
      // This is an elif, connect previous condition's No branch to this condition
      ctx.addEdge(previousConditionId, conditionId, 'No');
      // Don't call linkNext here as we've already made the specific connection
    } else {
      // This is the first condition, connect normally
      linkNext(ctx, conditionId);
    }

    // Register if context for branch handling
    const hasElse = !!currentNode.else;
    if (typeof ctx.registerIf === 'function') {
      ctx.registerIf(conditionId, hasElse);
    }

    // Enter the then branch and process it
    if (typeof ctx.enterBranch === 'function') {
      ctx.enterBranch('then');
    }

    // Process the then statement
    if (currentNode.then && mapper) {
      if (currentNode.then.type === 'Block' && currentNode.then.body) {
        // Process block body
        if (Array.isArray(currentNode.then.body)) {
          currentNode.then.body.forEach(child => {
            if (child && mapper) {
              mapper(child, ctx);
            }
          });
        } else {
          // If body is not an array, map it directly
          mapper(currentNode.then.body, ctx);
        }
      } else {
        // If it's not a block, map the then statement directly
        mapper(currentNode.then, ctx);
      }
    }

    // Exit the then branch
    if (typeof ctx.exitBranch === 'function') {
      ctx.exitBranch('then');
    }

    // Check if there's an else branch
    if (currentNode.else) {
      // Enter the else branch
      if (typeof ctx.enterBranch === 'function') {
        ctx.enterBranch('else');
      }

      // Check if the else branch is another If (elif) or a regular else
      if (currentNode.else.type === 'If') {
        // This is an elif, we'll process it in the next iteration
        previousConditionId = conditionId;
        currentNode = currentNode.else;
        
        // Don't exit the else branch here, as we'll continue processing
        // the elif as part of the same chain
        // Continue to process the elif in next iteration
        continue;
      } else {
        // This is a regular else branch, process it normally
        // Don't use the general mapper here to avoid re-processing as separate If
        // Instead, handle the else branch content directly
        if (currentNode.else.type === 'Block' && currentNode.else.body) {
          // Process block body
          if (Array.isArray(currentNode.else.body)) {
            currentNode.else.body.forEach(child => {
              if (child && mapper) {
                mapper(child, ctx);
              }
            });
          } else {
            // If body is not an array, map it directly
            mapper(currentNode.else.body, ctx);
          }
        } else {
          // If it's not a block, map the else statement directly
          mapper(currentNode.else, ctx);
        }
      }

      // Exit the else branch
      if (typeof ctx.exitBranch === 'function') {
        ctx.exitBranch('else');
      }
    }

    // Complete this if statement and handle branch merging
    if (typeof ctx.completeIf === 'function') {
      ctx.completeIf();
    }
    
    // Exit the loop since there's no elif chain to continue
    currentNode = null;
  }
}