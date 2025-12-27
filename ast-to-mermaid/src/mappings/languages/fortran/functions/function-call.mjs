import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../../c/mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.box.replace('{}', text);

/**
 * Map function call to Mermaid flowchart nodes
 * @param {Object} node - Normalized function call node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionCall(node, ctx) {
  if (!node || !ctx) return;
  
  const callId = ctx.next();
  const callText = node.callee?.name ? `${node.callee.name}()` : "function call";
  ctx.add(callId, processShape(callText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, callId);
}
