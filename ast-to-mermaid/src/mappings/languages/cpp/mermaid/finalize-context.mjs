export function finalizeFlowContext(context) {
  if (!context) return null;

  if (typeof context.completeBranches === 'function') {
    context.completeBranches();
  }

  const endId = context.next();
  context.add(endId, '(["end"])');

  if (typeof context.resolvePendingJoins === 'function') {
    context.resolvePendingJoins(endId);
  }

  // Note: pendingBreaks should be empty here if completeSwitch was called properly
  // Only connect breaks that are still pending (shouldn't happen in normal flow)
  if (context.pendingBreaks && context.pendingBreaks.length > 0) {
    context.pendingBreaks.forEach(breakInfo => {
      // Connect orphaned breaks directly to end
      context.addEdge(breakInfo.breakId, endId);
    });
    context.pendingBreaks = [];
  }

  // Note: Default case without break also needs to connect to next statement
  // But only if there are no pending joins (which would handle this connection)
  if (context.last && (!context.pendingJoins || context.pendingJoins.length === 0)) {
    context.addEdge(context.last, endId);
  }

  return endId;
}