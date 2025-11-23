import { shapes } from "../mermaid/shapes.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map switch statement to Mermaid flowchart nodes
 * Creates decision node for switch condition
 * @param {Object} node - Normalized switch statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapSwitch(node, ctx) {
  if (!node || !ctx) return;
  
  // Create decision node for switch condition
  const switchId = ctx.next();
  const switchText = `switch ${node.cond?.text || "expression"}`;
  ctx.add(switchId, decisionShape(switchText));
}