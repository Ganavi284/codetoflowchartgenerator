import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create memory operation shape with text
const memoryShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ delete operations to Mermaid flowchart nodes
 * @param {Object} node - Normalized delete node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDelete(node, ctx) {
  if (!node || !ctx) return;
  
  // Create delete operation node
  const deleteId = ctx.next();
  const deleteText = node.text || "delete operation";
  ctx.add(deleteId, memoryShape(deleteText));
  
  linkNext(ctx, deleteId);
}