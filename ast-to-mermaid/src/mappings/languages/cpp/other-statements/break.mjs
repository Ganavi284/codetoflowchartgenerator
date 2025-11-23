import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map break statement to Mermaid flowchart nodes
 * Creates process node for break statement
 * @param {Object} node - Normalized break statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapBreakStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for break statement
  const breakId = ctx.next();
  const breakText = "break;";
  ctx.add(breakId, processShape(breakText));
  
  // Connect break statement to flowchart
  linkNext(ctx, breakId);
  
  // If we're in a switch statement, store this break node for later connection
  if (ctx.currentSwitchId && ctx.switchEndNodes && ctx.switchEndNodes.length > 0) {
    // Store this break node ID so we can connect it to the end node later
    if (!ctx.pendingBreaks) {
      ctx.pendingBreaks = [];
    }
    // Record break with current switch level (length - 1)
    ctx.pendingBreaks.push({breakId: breakId, switchLevel: (ctx.switchEndNodes.length || 1) - 1});
    // For switch breaks, we've already handled connections via linkNext
    // No need to set ctx.last = null
  }
  
  // Reset consecutive case tracking since break terminates the current case block
  if (ctx.previousCaseId) {
    ctx.previousCaseId = null;
  }
}