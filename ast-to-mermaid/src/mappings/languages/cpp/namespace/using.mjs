import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create using declaration shape with text
const usingShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ using namespace declarations to Mermaid flowchart nodes
 * @param {Object} node - Normalized using node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapUsing(node, ctx) {
  if (!node || !ctx) return;
  
  // Create using node
  const usingId = ctx.next();
  const usingText = node.text || "using namespace declaration";
  ctx.add(usingId, usingShape(usingText));
  
  linkNext(ctx, usingId);
}