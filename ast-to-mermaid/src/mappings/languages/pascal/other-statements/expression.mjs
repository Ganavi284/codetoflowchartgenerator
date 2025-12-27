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
  
  const exprText = node.text || "expression";
  
  // Filter out Pascal block keywords that shouldn't create flowchart nodes
  if (exprText.trim().toLowerCase() === 'end' || 
      exprText.trim().toLowerCase() === 'begin' ||
      exprText.trim().toLowerCase() === 'then' ||
      exprText.trim().toLowerCase() === 'else') {
    // Skip creating nodes for structural keywords
    return;
  }
  
  // Create expression node
  const exprId = ctx.next();
  ctx.add(exprId, processShape(exprText));
  
  // Connect to previous node
  // If we're in a loop, use the loop body connection method
  if (ctx.inLoop && typeof ctx.handleLoopBodyConnection === 'function') {
    ctx.handleLoopBodyConnection(exprId);
  } else if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
    ctx.handleBranchConnection(exprId);
  } else {
    linkNext(ctx, exprId);
  }
}