import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function declaration shape with text
const funcDeclShape = (text) => shapes.process.replace('{}', text);

/**
 * Map C++ function declarations to Mermaid flowchart nodes
 * @param {Object} node - Normalized function declaration node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionDecl(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function declaration node
  const funcDeclId = ctx.next();
  const funcDeclText = node.text || "function declaration";
  ctx.add(funcDeclId, funcDeclShape(funcDeclText));
  
  linkNext(ctx, funcDeclId);
}