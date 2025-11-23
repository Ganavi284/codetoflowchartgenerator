import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map assignment statement to Mermaid flowchart nodes
 * Creates process node for assignment operation
 * @param {Object} node - Normalized assignment node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssign(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for assignment
  const assignId = ctx.next();
  const assignText = node.text || "assignment";
  ctx.add(assignId, processShape(assignText));
  
  // Connect to previous node and set as last
  linkNext(ctx, assignId);
}