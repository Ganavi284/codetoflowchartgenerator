import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map assignment statement to Mermaid flowchart nodes
 * Creates a process node for assignment statements
 * @param {Object} node - Normalized assignment statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssign(node, ctx) {
  // If we're in a loop, use the loop body connection method instead of deferring
  if (ctx.inLoop && ctx.deferredStatements) {
    const id = ctx.next();
    ctx.add(id, processShape(node.text));
    
    // Use the loop body connection method
    if (typeof ctx.handleLoopBodyConnection === 'function') {
      ctx.handleLoopBodyConnection(id);
    } else {
      linkNext(ctx, id);
    }
    return;
  }
  
  const id = ctx.next();
  ctx.add(id, processShape(node.text));
  
  // Connect to previous node
  linkNext(ctx, id);
}