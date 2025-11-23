export const decision = (t) => `{${t}}`;
export const process = (t) => `[${t}]`;
export const io = (t) => `[/ ${t} /]`;

// Export shapes for compatibility with existing code
export const shapes = {
  decision: (t) => `{${t}}`,
  process: (t) => `[${t}]`,
  io: (t) => `[/ ${t} /]`
};

export function linkNext(ctx, id) {
  if (!ctx) return;

  const joined = typeof ctx.resolvePendingJoins === 'function'
    ? ctx.resolvePendingJoins(id)
    : false;

  if (typeof ctx.handleBranchConnection === 'function'
      && ctx.handleBranchConnection(id, { skipEdge: joined })) {
    return;
  }

  // Track executed statements within switch cases
  if (ctx.currentSwitchId && ctx.switchExecutedStatements) {
    ctx.switchExecutedStatements.push(id);
  }

  // For switch statements, we need to maintain sequential flow within cases
  // while also tracking all executed statements for final connection
  if (!joined && ctx.last) {
    ctx.addEdge(ctx.last, id);
  }

  ctx.last = id;
}