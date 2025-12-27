export function finalizeFlowContext(context) {
  if (!context) return null;

  // Complete any remaining branches (joins queued by if handling)
  if (context.pendingJoins && context.pendingJoins.length > 0) {
    // Create end node
    const endId = context.next();
    context.add(endId, '(["end"])');
    const joins = context.pendingJoins.splice(0);
    joins.forEach(join => {
      join.edges.forEach(({ from, label }) => {
        if (!from) return;
        if (label) {
          context.addEdge(from, endId, label);
        } else {
          context.addEdge(from, endId);
        }
      });
    });
    return endId;
  }

  // Add end node and connect last node if present
  const endId = context.next();
  context.add(endId, '(["end"])');
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  return endId;
}