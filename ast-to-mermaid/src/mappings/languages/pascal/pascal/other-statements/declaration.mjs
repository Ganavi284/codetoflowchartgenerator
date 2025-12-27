import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map declaration statement to Mermaid flowchart nodes
 * Creates a process node for declaration statements
 * @param {Object} node - Normalized declaration statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDecl(node, ctx) {
  if (!node || !ctx) return;
  
  // Create declaration node
  const declId = ctx.next();
  const declText = node.text || "declaration";
  ctx.add(declId, processShape(declText));
  
  // Connect to previous node
  linkNext(ctx, declId);
}