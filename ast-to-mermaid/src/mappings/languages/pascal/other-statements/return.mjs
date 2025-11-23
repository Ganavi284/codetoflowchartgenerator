import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map return statement to Mermaid flowchart nodes
 * Creates a process node for return statements
 * @param {Object} node - Normalized return statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapReturn(node, ctx) {
  if (!node || !ctx) return;
  
  // Create return node
  const returnId = ctx.next();
  const returnText = `return ${node.value || ""}`;
  ctx.add(returnId, processShape(returnText));
  
  // Connect to previous node
  linkNext(ctx, returnId);
}