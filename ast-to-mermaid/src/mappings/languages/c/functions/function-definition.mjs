import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function shape with text
const functionShape = (text) => shapes.function.replace('{}', text);

/**
 * Map function definition to Mermaid flowchart nodes
 * Creates double rectangle node for function definition
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunction(node, ctx) {
  if (!node || !ctx) return;
  
  // Skip creating a node for the main function
  if (node.name === 'main' || node.name === 'main()') return;
  
  // Create function node
  const functionId = ctx.next();
  const functionText = `function ${node.name || "unknown"}`;
  ctx.add(functionId, functionShape(functionText));
  
  // Connect to previous node and set as last
  linkNext(ctx, functionId);
}