import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map expression statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized expression statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapExpr(node, ctx) {
  if (!node || !ctx) return;
  
  const exprId = ctx.next();
  const exprText = node.text || "expression";
  ctx.add(exprId, processShape(exprText));
  
  linkNext(ctx, exprId);
}
