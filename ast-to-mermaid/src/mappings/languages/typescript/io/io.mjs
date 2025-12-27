import { shapes } from "../../../mermaid/shapes.mjs";
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
  
  // Process the text to extract console.log content properly
  let displayText = node.text || "IO operation";
  if (displayText.includes('console.log')) {
    // Extract content between parentheses and remove quotes
    const match = displayText.match(/console\.log\s*\((.*)\)/);
    if (match && match[1]) {
      displayText = match[1].trim();
      // Remove surrounding quotes if present
      if ((displayText.startsWith('"') && displayText.endsWith('"')) || 
          (displayText.startsWith("'") && displayText.endsWith("'"))) {
        displayText = displayText.substring(1, displayText.length - 1);
      }
      displayText = `console.log(${displayText})`;
    }
  } else {
    displayText = node.text || "IO operation";
  }
  
  ctx.add(ioId, ioShape(displayText));
  
  
  // Use branch connection logic if we're in a branch, otherwise use direct connection
  if (typeof ctx.handleBranchConnection === 'function' && ctx.currentIf && ctx.currentIf()) {
    ctx.handleBranchConnection(ioId);
  } else {
    linkNext(ctx, ioId);
  }
  
  // If this IO operation contains function calls, store them for later connection
  if (node.functionCalls && Array.isArray(node.functionCalls)) {
    node.functionCalls.forEach(funcName => {
      if (!ctx.functionCalls) {
        ctx.functionCalls = [];
      }
      ctx.functionCalls.push({
        callId: ioId,
        functionName: funcName
      });
    });
  }
}