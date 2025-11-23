export const decision = (t) => `{${t}}`;
export const process = (t) => `["${t}"]`;;

export function linkNext(ctx, id) {
  if (!ctx) return;

  const joined = typeof ctx.resolvePendingJoins === 'function'
    ? ctx.resolvePendingJoins(id)
    : false;

  if (typeof ctx.handleBranchConnection === 'function'
      && ctx.handleBranchConnection(id, { skipEdge: joined })) {
    return;
  }

  if (!joined && ctx.last) {
    ctx.addEdge(ctx.last, id);
  }

  ctx.last = id;
}