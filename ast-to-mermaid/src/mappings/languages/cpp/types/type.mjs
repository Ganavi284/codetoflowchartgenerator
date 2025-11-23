import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create type declaration shape with text
const typeShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ type declarations to Mermaid flowchart nodes
 * @param {Object} node - Normalized type node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapType(node, ctx) {
  if (!node || !ctx) return;
  
  // Create type node
  const typeId = ctx.next();
  const typeText = node.text || "type declaration";
  ctx.add(typeId, typeShape(typeText));
  
  linkNext(ctx, typeId);
}