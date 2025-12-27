import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map assignment statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized assignment statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssign(node, ctx) {
  if (!node || !ctx) return;
  
  const assignId = ctx.next();
  const assignText = node.text || "assignment";
  ctx.add(assignId, processShape(assignText));
  
  linkNext(ctx, assignId);
}
