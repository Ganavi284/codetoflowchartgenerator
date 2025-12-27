import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Decision shape like C/C++
const decisionShape = (text) => shapes.rhombus.replace("{}", text);

/**
 * Map Fortran do/for loop to Mermaid flowchart nodes (C/C++ style)
 * Creates a single decision node with header text.
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;

  const forId = ctx.next();
  const headerText = node.cond?.text || "";
  const forText = `do (${headerText})`;
  ctx.add(forId, decisionShape(forText));

  linkNext(ctx, forId);

  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: "for",
    loopId: forId,
  });
}
