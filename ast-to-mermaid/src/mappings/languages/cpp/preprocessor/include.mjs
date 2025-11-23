import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create preprocessor shape with text
const preprocShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ #include directives to Mermaid flowchart nodes
 * @param {Object} node - Normalized include node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapInclude(node, ctx) {
  if (!node || !ctx) return;
  
  // Create include node
  const includeId = ctx.next();
  const includeText = node.text || "#include directive";
  ctx.add(includeId, preprocShape(includeText));
  
  linkNext(ctx, includeId);
}