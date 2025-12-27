import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop similar to C implementation
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  
  // Extract and format the for loop information similar to C approach
  let loopText = 'for loop';
  if (node.init?.text) {
    // Parse Pascal for loop format: variable := start to/downto end
    const match = node.init.text.match(/^(\w+)\s*:=?\s*(.+?)\s+(to|downto)\s+(.+)$/);
    if (match) {
      const varName = match[1];
      const startValue = match[2];
      const direction = match[3];
      const endValue = match[4];
      const condition = direction === 'to' ? `${varName} <= ${endValue}` : `${varName} >= ${endValue}`;
      const increment = direction === 'to' ? `${varName}++` : `${varName}--`;
      loopText = `for ${varName} := ${startValue} to ${endValue} (${condition}, ${increment})`;
    } else {
      // Fallback for different formats
      loopText = `for (${node.init.text})`;
    }
  }
  
  ctx.add(forId, decisionShape(loopText));
  
  // Connect to previous node and set as last
  linkNext(ctx, forId);
  
  // Store loop information for later connection
  ctx.pendingLoops = ctx.pendingLoops || [];
  ctx.pendingLoops.push({
    type: 'for',
    loopId: forId
  });
}