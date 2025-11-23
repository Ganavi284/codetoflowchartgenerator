import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map expression statement to Mermaid flowchart nodes
 * Creates a process node for expression statements
 * @param {Object} node - Normalized expression statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapExpr(node, ctx) {
  if (!node || !ctx) return;
  
  // Create expression node
  const exprId = ctx.next();
  const exprText = node.text || "expression";
  ctx.add(exprId, processShape(exprText));
  
  // Connect to previous node
  linkNext(ctx, exprId);
}