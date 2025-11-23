import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create class shape with text
const classShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ class definitions to Mermaid flowchart nodes
 * @param {Object} node - Normalized class node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapClass(node, ctx) {
  if (!node || !ctx) return;
  
  // Create class node
  const classId = ctx.next();
  const classText = node.text || "class definition";
  ctx.add(classId, classShape(classText));
  
  linkNext(ctx, classId);
}