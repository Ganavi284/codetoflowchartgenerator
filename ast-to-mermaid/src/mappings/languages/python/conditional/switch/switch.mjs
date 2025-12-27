import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

/**
 * Map Python Match statement to Mermaid flowchart nodes
 * Creates decision node for the first pattern check
 * @param {Object} node - Normalized Match statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapMatch(node, ctx) {
  // Set up the switch end node placeholder before processing the switch
  if (!ctx.switchEndNodes) {
    ctx.switchEndNodes = [];
  }
  ctx.switchEndNodes.push(null); // Placeholder for end node ID
  
  // Create the first condition check node
  const firstCase = node.cases && node.cases[0] ? node.cases[0] : null;
  const id = ctx.next();
  
  if (firstCase) {
    // Create condition check for first case: "match subject == pattern?"
    const patternText = firstCase.pattern?.text || "pattern";
    const subjectText = node.subject?.text || "expression";
    ctx.add(id, decisionShape(`match ${subjectText} == ${patternText}?`));
  } else {
    // Fallback if no cases
    ctx.add(id, decisionShape("match " + (node.subject?.text || "expression")));
  }
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, id);
  
  // Store the switch node ID for later use in case connections
  ctx.currentSwitchId = id;
  
  // Initialize case tracking
  ctx.caseIndex = 0;
  ctx.caseConditionNodes = [id]; // Store condition nodes for each case
  ctx.casePatterns = []; // Store case patterns for condition labels
  
  if (node.cases && node.cases.length > 0) {
    node.cases.forEach((caseNode, index) => {
      ctx.casePatterns.push(caseNode.pattern?.text || `pattern${index}`);
    });
  }
  
  // Store context for case processing
  ctx.matchContext = {
    caseIndex: 0,
    caseConditionNodes: ctx.caseConditionNodes,
    casePatterns: ctx.casePatterns,
    subject: node.subject?.text || "expression"
  };
}

/**
 * Map Python case statement - but don't create a node for the case itself
 * Instead, set up the connection so the case body connects to the condition
 * @param {Object} node - Normalized case statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapCase(node, ctx) {
  if (!node || !ctx || !ctx.matchContext) return;
  
  const caseIndex = ctx.matchContext.caseIndex || 0;
  
  // Store which condition node this case's body should connect to with "Yes"
  const conditionNodeId = ctx.matchContext.caseConditionNodes[caseIndex];
  ctx.pendingCaseCondition = conditionNodeId;
  
  // If this is not the last case, we need to create the next condition check
  // and connect from the current condition with "No" label
  if (ctx.matchContext.casePatterns && caseIndex < ctx.matchContext.casePatterns.length - 1) {
    // Create the next condition check
    const nextConditionId = ctx.next();
    const nextPattern = ctx.matchContext.casePatterns[caseIndex + 1] || `pattern${caseIndex + 1}`;
    const subjectText = ctx.matchContext.subject;
    ctx.add(nextConditionId, decisionShape(`match ${subjectText} == ${nextPattern}?`));
    
    // Connect from current condition to next condition with "No" label
    ctx.addEdge(conditionNodeId, nextConditionId, "No");
    
    // Store the next condition node
    ctx.matchContext.caseConditionNodes.push(nextConditionId);
  }
  
  // Increment case index
  ctx.matchContext.caseIndex = caseIndex + 1;
}

/**
 * Map Python default case - but don't create a node for the default itself
 * @param {Object} node - Normalized default case node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDefault(node, ctx) {
  if (!node || !ctx || !ctx.matchContext) return;
  
  // For the default case, connect from the last condition node with "No" label
  if (ctx.matchContext.caseConditionNodes && ctx.matchContext.caseConditionNodes.length > 0) {
    const lastConditionId = ctx.matchContext.caseConditionNodes[ctx.matchContext.caseConditionNodes.length - 1];
    ctx.pendingCaseCondition = lastConditionId;
  }
}