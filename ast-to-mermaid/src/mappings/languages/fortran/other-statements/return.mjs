import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map return statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized return statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapReturn(node, ctx) {
  if (!node || !ctx) return;
  
  const returnId = ctx.next();
  const returnText = node.text || "return";
  ctx.add(returnId, processShape(returnText));
  
  linkNext(ctx, returnId);
}
