import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map function definition to Mermaid flowchart nodes
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunction(node, ctx) {
  if (!node || !ctx) return;
  
  const funcId = ctx.next();
  const funcText = node.name ? `function ${node.name}` : "function";
  ctx.add(funcId, processShape(funcText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, funcId);
}
