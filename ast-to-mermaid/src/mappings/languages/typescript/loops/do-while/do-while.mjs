import { shapes } from "../../../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map do-while statement to Mermaid flowchart nodes
 * Creates process nodes for the body and decision node for the condition
 * @param {Object} node - Normalized do-while statement node
 * @param {Object} ctx - Context for flowchart generation
 * @param {Function} mapper - Recursive mapper function
 */
export function mapDoWhileStatement(node, ctx, mapper) {
  if (!node || !ctx || !mapper) return;

  // We need to capture the ID of the first statement in the body
  // Process the loop body first and capture the first statement ID
  let firstStatementId = null;
  
  // For do-while, we first execute the body, then check the condition
  // Process the loop body first
  if (node.body) {
    if (node.body.body && Array.isArray(node.body.body) && mapper) {
      // Process each statement in the loop body
      node.body.body.forEach((stmt, index) => {
        if (stmt && mapper) {
          // Capture the ID of the first statement
          const originalLast = ctx.last;
          mapper(stmt, ctx);
          if (index === 0 && ctx.last && !firstStatementId) {
            firstStatementId = ctx.last;
          }
        }
      });
    } else if (mapper) {
      // Handle single statement body
      const originalLast = ctx.last;
      mapper(node.body, ctx);
      if (ctx.last && !firstStatementId) {
        firstStatementId = ctx.last;
      }
    }
  }

  // Create a node for the do-while loop condition
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
  
  const loopText = `while (${conditionText})`;
  ctx.add(loopConditionId, decisionShape(loopText));

  // Connect from the end of the loop body to the condition check
  if (ctx.last && ctx.last !== loopConditionId) {
    ctx.addEdge(ctx.last, loopConditionId);
  }

  // Connect back from condition to the beginning of the loop body for continuation
  // This creates the loop structure - if condition is true, go back to the first statement of the loop body
  if (firstStatementId && firstStatementId !== loopConditionId) {
    // Add a connection from the condition node back to the first statement of the loop body
    // In Mermaid, we'll add this as a special edge that represents the loop continuation
    ctx.addEdge(loopConditionId, firstStatementId);
  }
}