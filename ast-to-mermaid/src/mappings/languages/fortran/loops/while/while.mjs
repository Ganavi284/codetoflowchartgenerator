import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../../c/mappings/common/common.mjs";

const decisionShape = (text) => shapes.rhombus.replace("{}", text);

/**
 * Map Fortran while loop to Mermaid decision node (C/C++ style)
 */
export function mapWhile(node, ctx) {
  if (!node || !ctx) return;

  const whileId = ctx.next();
  const condText = node.cond?.text || node.test?.text || "condition";
  const whileText = `while ${condText}`;
  ctx.add(whileId, decisionShape(whileText));

  linkNext(ctx, whileId);

  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: "while",
    loopId: whileId,
  });
}