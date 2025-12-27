import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map declaration statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized declaration statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDecl(node, ctx) {
  if (!node || !ctx) return;
  
  const declId = ctx.next();
  const declText = node.text || "declaration";
  ctx.add(declId, processShape(declText));
  
  linkNext(ctx, declId);
}
