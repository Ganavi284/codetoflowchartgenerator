export const decision = (t) => `{${t}}`;
export const process = (t) => `[${t}]`;

export function linkNext(ctx, id) {
  if (ctx.last) ctx.addEdge(ctx.last, id);
  ctx.last = id;
}