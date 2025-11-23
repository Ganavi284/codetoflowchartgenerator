/**
 * Do-while loop statement mapping for C++ language
 */

import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map do-while loop to Mermaid flowchart nodes
 * Creates decision node for loop condition
 * @param {Object} node - Normalized do-while loop node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDoWhile(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for condition
  const doWhileId = ctx.next();
  const doWhileText = `while ${node.cond?.text || "condition"}`;
  ctx.add(doWhileId, decisionShape(doWhileText));
  
  // Connect to previous node and set as last
  linkNext(ctx, doWhileId);
}