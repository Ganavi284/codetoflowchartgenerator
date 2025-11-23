import { process } from "../mappings/common/common.mjs";

export function mapMixed(node, ctx) {
  const id = ctx.next();
  ctx.add(id, process(node.text));
}