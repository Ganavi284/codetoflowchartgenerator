import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../../c/mappings/common/common.mjs";

const decisionShape = (text) => shapes.rhombus.replace("{}", text);

/**
 * Map Fortran do-while loop to Mermaid decision node (C/C++ style)
 * Body executes before condition; we track the loop for finalize handling.
 */
export function mapDoWhile(node, ctx) {
  if (!node || !ctx) return;

  const doWhileId = ctx.next();
  const condText = node.cond?.text || node.test?.text || "condition";
  const doWhileText = `while ${condText}`;
  ctx.add(doWhileId, decisionShape(doWhileText));

  linkNext(ctx, doWhileId);

  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: "do-while",
    loopId: doWhileId,
  });
}

