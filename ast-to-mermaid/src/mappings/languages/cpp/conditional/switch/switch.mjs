import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

export function mapSwitch(node, ctx) {
  // Set up the switch end node placeholder before processing the switch
  if (!ctx.switchEndNodes) {
    ctx.switchEndNodes = [];
  }
  ctx.switchEndNodes.push(null); // Placeholder for end node ID
  
  // Create the switch node
  const id = ctx.next();
  ctx.add(id, decisionShape("switch " + node.cond.text));
  
  // Connect to previous node
  if (ctx.last) {
    ctx.addEdge(ctx.last, id, "Yes");
  }
  
  // Set the switch node as the last node
  ctx.last = id;
  
  // Store the switch node ID for later use in case connections
  ctx.currentSwitchId = id;
}

/**
 * Map case statement to Mermaid flowchart nodes
 * Creates process node for case statement
 * @param {Object} node - Normalized case statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapCase(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for case statement
  const caseId = ctx.next();
  const caseText = `case ${node.value || ""}:`;
  ctx.add(caseId, processShape(caseText));
  
  // Connect from switch node to this case
  if (ctx.currentSwitchId) {
    ctx.addEdge(ctx.currentSwitchId, caseId);
  }
  
  // Set as last node to maintain sequential flow within cases
  ctx.last = caseId;
}

/**
 * Map default case to Mermaid flowchart nodes
 * Creates process node for default case
 * @param {Object} node - Normalized default case node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDefault(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for default case
  const defaultId = ctx.next();
  const defaultText = "default:";
  ctx.add(defaultId, processShape(defaultText));
  
  // Connect from switch node to this default case
  if (ctx.currentSwitchId) {
    ctx.addEdge(ctx.currentSwitchId, defaultId);
  }
  
  // Set as last node to maintain sequential flow within cases
  ctx.last = defaultId;
}