import { shapes } from "../../../../mermaid/shapes.mjs";
import { linkNext } from "../../../../common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map for statement to Mermaid flowchart nodes
 * Creates decision node for the condition and connects the loop body
 * @param {Object} node - Normalized for statement node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapForStatement(node, ctx, mapper) {
  if (!node || !ctx || !mapper) return;

  // Create a node for the for loop condition
  const loopConditionId = ctx.next();
  
  // Extract the condition text for the loop
  let conditionText = "condition";
  if (node.test) {
    if (typeof node.test === 'string') {
      conditionText = node.test;
    } else if (node.test.text) {
      conditionText = node.test.text;
    }
  }
  
  // Format the condition properly for display
  if (conditionText.startsWith('(') && conditionText.endsWith(')')) {
    conditionText = conditionText.substring(1, conditionText.length - 1);
  }
  
  const loopText = `for (${conditionText})`;
  ctx.add(loopConditionId, decisionShape(loopText));

  // Connect to previous node
  linkNext(ctx, loopConditionId);

  // Process the loop body
  if (node.body) {
    if (node.body.body && Array.isArray(node.body.body) && mapper) {
      // Process each statement in the loop body
      node.body.body.forEach(stmt => {
        if (stmt && mapper) {
          mapper(stmt, ctx);
        }
      });
    } else if (mapper) {
      // Handle single statement body
      mapper(node.body, ctx);
    }
  }

  // Connect back to the loop condition for the loop continuation
  if (ctx.last && ctx.last !== loopConditionId) {
    ctx.addEdge(ctx.last, loopConditionId);
  }
}