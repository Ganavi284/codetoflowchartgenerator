import { process } from "../mappings/common/common.mjs";

export function mapError(node, ctx) {
  const id = ctx.next();
  ctx.add(id, process(node.text));
}