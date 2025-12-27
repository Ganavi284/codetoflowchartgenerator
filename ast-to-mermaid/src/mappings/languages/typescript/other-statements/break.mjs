import { shapes } from "../../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

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
  
  // If we're in a switch statement, track the break for proper connection
  if (ctx.currentSwitchId) {
    // Connect break statement to the previous statement in the case
    if (ctx.last) {
      ctx.addEdge(ctx.last, breakId);
    }
    
    // Then track the break statement with its switch level for later connection
    const switchLevel = (ctx.switchEndNodes?.length || 1) - 1;
    if (!ctx.pendingBreaks) {
      ctx.pendingBreaks = [];
    }
    // Use a marker value that will be replaced in finalize context
    ctx.pendingBreaks.push({ breakId, switchLevel, nextStatementId: 'NEXT_AFTER_SWITCH' });
    
    // Don't set breakId as the last node to avoid linear connection after break
    // The break should not continue the linear flow, it should exit the switch
  } else {
    // For non-switch breaks (e.g., in loops), connect break statement to flowchart normally
    linkNext(ctx, breakId);
  }
  
  // Reset consecutive case tracking since break terminates the current case block
  if (ctx.previousCaseId) {
    ctx.previousCaseId = null;
  }
}