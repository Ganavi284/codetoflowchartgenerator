import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map IO statement to Mermaid flowchart nodes
 * @param {Object} node - Normalized IO statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIO(node, ctx) {
  if (!node || !ctx) return;
  
  const ioId = ctx.next();
  const ioText = node.text || "IO operation";
  ctx.add(ioId, processShape(ioText));
  
    linkNext(ctx, ioId);
}
