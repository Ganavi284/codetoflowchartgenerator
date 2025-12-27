import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map Pascal Case statement to Mermaid flowchart nodes
 * Creates decision node for case statement
 * @param {Object} node - Normalized Case statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapCase(node, ctx) {
  // Create the case node
  const id = ctx.next();
  ctx.add(id, decisionShape("case " + (node.cond?.text || "expression")));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, id);
  
  // Register this case statement with the context
  if (typeof ctx.registerCase === 'function') {
    ctx.registerCase(id);
  }
  
  // Store the case node ID for later use in case connections
  ctx.currentCaseId = id;
  
  // Initialize case options array
  ctx.caseOptions = [];
}

/**
 * Map Pascal case option to Mermaid flowchart nodes
 * Creates process node for case option
 * @param {Object} node - Normalized case option node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapCaseOption(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for the case option label
  const optionId = ctx.next();
  
  // Always create just the case label
  let optionText = `case ${node.value || ""}:`;
  
  ctx.add(optionId, processShape(optionText));
  
  // Store the case option for later connection
  if (!ctx.caseOptions) {
    ctx.caseOptions = [];
  }
  ctx.caseOptions.push(optionId);
  
  // Connect from case node to this option
  if (ctx.currentCaseId) {
    ctx.addEdge(ctx.currentCaseId, optionId);
  }
  
  // Save the optionId so the next node (the body) can connect to it
  // But don't use ctx.last as that affects other nodes
  ctx.currentCaseOptionId = optionId;
  
  // Explicitly set ctx.last to this option so the next node connects to it
  // This will override the default connection from the case statement
  ctx.last = optionId;
}

/**
 * Map Pascal else case (default) to Mermaid flowchart nodes
 * Creates process node for else case
 * @param {Object} node - Normalized else case node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapElseCase(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for the else case (default case)
  const elseId = ctx.next();
  const elseText = "else:";
  
  ctx.add(elseId, processShape(elseText));
  
  // Connect from case node to this else case
  // This is the missing connection that was causing the issue
  if (ctx.currentCaseId) {
    ctx.addEdge(ctx.currentCaseId, elseId);
  }
  
  // Store that we have an else case in the context for later connection
  ctx.hasElseCase = true;
  
  // Set ctx.last to the else case so the next node connects to it
  ctx.last = elseId;
}