import { shapes } from "../../../mermaid/shapes.mjs";
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
  
  // If we're in a switch statement, create a pending join
  // The finalize context will handle connections to the next statement after switch
  if (ctx.currentSwitchId && ctx.switchEndNodes && ctx.switchEndNodes.length > 0) {
    // Create a pending join for this break statement
    if (!ctx.pendingJoins) {
      ctx.pendingJoins = [];
    }
    ctx.pendingJoins.push({ edges: [{ from: breakId, label: null }] });
  } else {
    // For non-switch breaks, connect break statement to flowchart normally
    linkNext(ctx, breakId);
  }
  
  // Reset consecutive case tracking since break terminates the current case block
  if (ctx.previousCaseId) {
    ctx.previousCaseId = null;
  }
}