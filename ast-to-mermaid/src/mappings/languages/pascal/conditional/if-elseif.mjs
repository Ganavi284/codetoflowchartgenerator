import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map if-elseif statement to Mermaid flowchart nodes
 * Creates decision node with Yes/No branches
 * @param {Object} node - Normalized if-elseif statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIfElseIfStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const conditionId = ctx.next();
  
  // Determine if this is an "if" or "else if" statement
  // Check if we're currently in an else branch of a parent if
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
  // But don't connect sequentially if this is an else if statement
  if (!isElseIf) {
    linkNext(ctx, conditionId);
  }
  
  // Register if context for branch handling
  if (typeof ctx.registerIf === 'function') {
    // Check if this is the final else branch (not followed by another if)
    const hasElseIfChain = node.else && node.else.type === 'If';
    ctx.registerIf(conditionId, !!node.else && !hasElseIfChain);
  }
  
  // Process the then branch
  if (node.then) {
    // Enter the then branch
    if (typeof ctx.enterBranch === 'function') {
      ctx.enterBranch('then');
    }
    
    // Process statements in the then block
    if (node.then.body && Array.isArray(node.then.body)) {
      // For Pascal, we need to handle the body processing differently
      // We'll rely on the walker to process each statement
    }
    
    // Exit the then branch
    if (typeof ctx.exitBranch === 'function') {
      ctx.exitBranch('then');
    }
  }
  
  // Process the else branch (which could be another if statement)
  if (node.else) {
    // Enter the else branch
    if (typeof ctx.enterBranch === 'function') {
      ctx.enterBranch('else');
    }
    
    // For if-else-if chains, we need special handling
    // Check if the else branch is directly an If statement or wrapped in a Block
    let elseNode = node.else;
    if (elseNode.type === 'Block' && elseNode.body && Array.isArray(elseNode.body) && elseNode.body.length === 1) {
      // If it's a Block with a single statement, check if that statement is an If
      elseNode = elseNode.body[0];
    }
    
    // We'll temporarily override functions to capture when the next condition is added
    if (elseNode.type === 'If' || elseNode.type === 'IfElse') {
      // For if-else-if chains, we need to connect the No branch directly
      // We'll temporarily override the addEdge function to capture when
      // the next condition is added, then connect the No branch to it
      const originalAddEdge = ctx.addEdge;
      let nextConditionId = null;
      
      // Temporarily override the add function to capture the next condition ID
      const originalAdd = ctx.add;
      ctx.add = function(id, shape) {
        // If this is a decision node (contains '{'), capture its ID
        if (shape && shape.includes('{') && !nextConditionId) {
          nextConditionId = id;
        }
        return originalAdd.call(this, id, shape);
      };
      
      // Temporarily override addEdge to prevent the automatic No branch connection
      ctx.addEdge = function(from, to, label) {
        // If this is trying to connect the current condition's No branch,
        // and we're about to connect to the next condition, skip it
        if (from === conditionId && label === 'No' && nextConditionId && to === nextConditionId) {
          // This is the connection we want to make, so allow it
          return originalAddEdge.call(this, from, to, label);
        } else if (from === conditionId && label === 'No') {
          // This is an automatic connection we want to prevent
          // Don't call the original addEdge
          return;
        } else {
          // For all other connections, use the original function
          return originalAddEdge.call(this, from, to, label);
        }
      };
      
      // Process the else branch (which is another if statement)
      // The walker will handle this
      
      // If we captured the next condition ID, connect the No branch to it
      if (nextConditionId) {
        ctx.addEdge(conditionId, nextConditionId, 'No');
      }
      
      // Restore the original functions
      ctx.add = originalAdd;
      ctx.addEdge = originalAddEdge;
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
  
  // Set the condition node as the last node
  ctx.last = conditionId;
}