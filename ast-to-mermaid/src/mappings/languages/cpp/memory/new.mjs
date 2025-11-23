import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create memory operation shape with text
const memoryShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ new operations to Mermaid flowchart nodes
 * @param {Object} node - Normalized new node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNew(node, ctx) {
  if (!node || !ctx) return;
  
  // Create new operation node
  const newId = ctx.next();
  const newText = node.text || "new operation";
  ctx.add(newId, memoryShape(newText));
  
  linkNext(ctx, newId);
}