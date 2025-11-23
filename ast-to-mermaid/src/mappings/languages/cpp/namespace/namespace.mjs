import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create namespace shape with text
const namespaceShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ namespace definitions to Mermaid flowchart nodes
 * @param {Object} node - Normalized namespace node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapNamespace(node, ctx) {
  if (!node || !ctx) return;
  
  // Create namespace node
  const namespaceId = ctx.next();
  const namespaceText = node.text || "namespace definition";
  ctx.add(namespaceId, namespaceShape(namespaceText));
  
  linkNext(ctx, namespaceId);
}