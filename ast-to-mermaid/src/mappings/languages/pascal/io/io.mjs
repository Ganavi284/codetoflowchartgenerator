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
  
  // Create IO node
  const ioId = ctx.next();
  const ioText = node.text || "IO operation";
  ctx.add(ioId, ioShape(ioText));
  
  // Handle if statement branch connections
  if (ctx.ifConditionId) {
    if (!ctx.thenBranchConnected) {
      // This is the first node in the then branch
      ctx.addEdge(ctx.ifConditionId, ioId, "Yes");
      ctx.thenBranchConnected = true;
      ctx.thenBranchLast = ioId; // Track the last node in then branch
      ctx.last = ioId;
      return;
    } else if (ctx.hasElseBranch && !ctx.elseBranchConnected) {
      // This is the first node in the else branch
      ctx.addEdge(ctx.ifConditionId, ioId, "No");
      ctx.elseBranchConnected = true;
      ctx.elseBranchLast = ioId; // Track the last node in else branch
      ctx.last = ioId;
      return;
    } else if (ctx.thenBranchConnected && !ctx.elseBranchConnected) {
      // This is a subsequent node in the then branch
      if (ctx.thenBranchLast) {
        ctx.addEdge(ctx.thenBranchLast, ioId);
        ctx.thenBranchLast = ioId;
      }
      ctx.last = ioId;
      return;
    } else if (ctx.elseBranchConnected) {
      // This is a subsequent node in the else branch
      if (ctx.elseBranchLast) {
        ctx.addEdge(ctx.elseBranchLast, ioId);
        ctx.elseBranchLast = ioId;
      }
      ctx.last = ioId;
      return;
    }
  }
  
  // Normal connection
  linkNext(ctx, ioId);
}