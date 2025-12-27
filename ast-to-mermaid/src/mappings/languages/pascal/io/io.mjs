import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

/**
 * Map IO operations to Mermaid flowchart nodes
 * Creates parallelogram nodes for input/output operations
 * @param {Object} node - Normalized IO node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIO(node, ctx) {
  if (!node || !ctx) return;
  
  const ioText = node.text || "IO operation";
  
  // Filter out Pascal block keywords that shouldn't create flowchart nodes
  if (ioText.trim().toLowerCase() === 'end' || 
      ioText.trim().toLowerCase() === 'begin' ||
      ioText.trim().toLowerCase() === 'then' ||
      ioText.trim().toLowerCase() === 'else') {
    // Skip creating nodes for structural keywords
    return;
  }
  
  // Create IO node
  const ioId = ctx.next();
  ctx.add(ioId, ioShape(ioText));
  
  // Use the shared linking logic which handles if statement branch connections
  // If we're in a loop, use the loop body connection method
  if (ctx.inLoop && typeof ctx.handleLoopBodyConnection === 'function') {
    ctx.handleLoopBodyConnection(ioId);
  } else if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
    ctx.handleBranchConnection(ioId);
  } else {
    linkNext(ctx, ioId);
  }
}