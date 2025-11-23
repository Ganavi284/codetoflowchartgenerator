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
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, id);
  
  // Store the switch node ID for later use in case connections
  ctx.currentSwitchId = id;
  
  // Initialize case tracking - we'll connect cases sequentially
  ctx.firstCaseId = null;
  ctx.previousCaseId = null;
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
  
  // Track the first case
  if (!ctx.firstCaseId) {
    ctx.firstCaseId = caseId;
    // Connect from switch node to the first case
    if (ctx.currentSwitchId) {
      ctx.addEdge(ctx.currentSwitchId, caseId);
    }
  } else {
    // Connect previous case to this case
    if (ctx.previousCaseId) {
      ctx.addEdge(ctx.previousCaseId, caseId);
    }
  }
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, caseId);
  
  // Track the previous case for sequential connection
  ctx.previousCaseId = caseId;
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
  
  // Connect from previous case to default case
  if (ctx.previousCaseId) {
    ctx.addEdge(ctx.previousCaseId, defaultId);
  } else if (!ctx.firstCaseId && ctx.currentSwitchId) {
    // If this is the first and only case, connect directly from switch
    ctx.addEdge(ctx.currentSwitchId, defaultId);
  }
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, defaultId);
  
  // Track the previous case for sequential connection
  ctx.previousCaseId = defaultId;
}