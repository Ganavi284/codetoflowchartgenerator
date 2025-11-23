import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map function definition to Mermaid flowchart nodes
 * Creates a process node for function definitions
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunction(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function node
  const functionId = ctx.next();
  const functionText = `function ${node.name || "unknown"}${node.parameters || "()"}`;
  ctx.add(functionId, processShape(functionText));
  
  // Connect to previous node
  linkNext(ctx, functionId);
}