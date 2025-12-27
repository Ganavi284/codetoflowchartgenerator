import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function definition shape with text (double rectangle like C/C++)
const functionDefinitionShape = (text) => shapes.function.replace("{}", text);

/**
 * Map Java method/function definition to Mermaid flowchart nodes
 * Aligns with C/C++ handling: skip main and use double-rectangle function nodes.
 * @param {Object} node - Normalized function definition node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionDefinition(node, ctx) {
  if (!node || !ctx) return;

  // Skip creating a node for the main entry point to reduce clutter
  if (node.name === "main" || node.name === "main()") return;

  const funcId = ctx.next();
  const funcText = `function ${node.name || "unknown"}`;
  ctx.add(funcId, functionDefinitionShape(funcText));

  // Connect to previous node and set as last
  linkNext(ctx, funcId);

  // Store function definition info for later subgraph creation
  if (!ctx.functionMap) {
    ctx.functionMap = {};
  }
  ctx.functionMap[node.name] = node;
}