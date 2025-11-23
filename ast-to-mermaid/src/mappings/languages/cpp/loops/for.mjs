/**
 * Loop statement mapping for C++ language
 */

import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map for loop to Mermaid flowchart nodes
 * Creates a single decision node for the entire loop
 * @param {Object} node - Normalized for loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFor(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for the entire for loop
  const forId = ctx.next();
  // Combine init, condition, and update into a single text
  const forText = `for (${node.init?.text || ""}; ${node.cond?.text || ""}; ${node.update?.text || ""})`;
  ctx.add(forId, decisionShape(forText));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, forId);
}