/**
 * Common mapping utilities for Java language
 */

/**
 * Link a new node to the previous node in the flow
 * @param {Object} ctx - Context for flowchart generation
 * @param {string} nodeId - ID of the new node to link
 * @param {string} [label] - Optional label for the edge
 */
export function linkNext(ctx, nodeId, label) {
  if (!ctx || !nodeId) return;
  
  // Check if we're processing the first loop body node
  if (ctx.isFirstLoopBodyNode) {
    // Connect from the current loop condition with 'Yes' label
    if (ctx.currentLoop && ctx.currentLoop.conditionId) {
      ctx.addEdge(ctx.currentLoop.conditionId, nodeId, 'Yes');
      ctx.last = nodeId;
    } else if (ctx.last) {
      ctx.addEdge(ctx.last, nodeId, label);
      ctx.last = nodeId;
    }
    // Clear the flag
    delete ctx.isFirstLoopBodyNode;
  } else if (ctx.last) {
    // If there's a previous node, connect it to this node
    ctx.addEdge(ctx.last, nodeId, label);
  }
  
  // Set this node as the last node for future connections
  ctx.last = nodeId;
}

/**
 * Link a new node as a loop body to the current loop condition
 * @param {Object} ctx - Context for flowchart generation
 * @param {string} nodeId - ID of the new node to link
 */
export function linkLoopBody(ctx, nodeId) {
  if (!ctx || !nodeId) return;
  
  // Connect from the current loop condition with 'Yes' label
  if (ctx.currentLoop && ctx.currentLoop.conditionId) {
    ctx.addEdge(ctx.currentLoop.conditionId, nodeId, 'Yes');
    // Set this node as the last node for future connections
    ctx.last = nodeId;
  } else {
    // Use direct context methods to avoid circular dependency
    if (ctx.last) {
      ctx.addEdge(ctx.last, nodeId);
      ctx.last = nodeId;
    } else {
      ctx.last = nodeId;
    }
  }
}

/**
 * Complete a switch statement by connecting all case branches
 * @param {Object} ctx - Context for flowchart generation
 */
export function completeSwitch(ctx) {
  if (!ctx || typeof ctx.completeSwitch !== 'function') return;
  
  // Delegate to context's completeSwitch method
  ctx.completeSwitch();
}