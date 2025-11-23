import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create exception shape with text
const exceptionShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ exception handling constructs to Mermaid flowchart nodes
 * @param {Object} node - Normalized exception node (try/catch/throw)
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapException(node, ctx) {
  if (!node || !ctx) return;
  
  // Create exception node
  const exceptionId = ctx.next();
  const exceptionText = node.text || "exception handling";
  ctx.add(exceptionId, exceptionShape(exceptionText));
  
  linkNext(ctx, exceptionId);
}