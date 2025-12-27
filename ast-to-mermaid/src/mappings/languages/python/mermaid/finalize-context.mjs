/**
 * Finalize flow context for Python
 * Adds end node and handles any pending connections
 */

export function finalizeFlowContext(context) {
  // Add end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // Connect the last node to the end node if there's a last node
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // Handle any pending branches or loops
  context.completeBranches();
  
  // Complete any active loops
  if (context.inLoop) {
    context.completeLoop();
  }
  
  // Clear any pending breaks
  context.pendingBreaks = [];
}