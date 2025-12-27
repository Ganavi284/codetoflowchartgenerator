import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function call shape with text
const functionCallShape = (text) => shapes.function.replace('{}', text);

/**
 * Map function call to Mermaid flowchart nodes
 * Creates double rectangle node for function call
 * @param {Object} node - Normalized function call node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionCall(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function call node
  const callId = ctx.next();
  
  // Extract function call information
  let callName = node.name || node.callee?.name || node.callee?.property?.name;
  
  // For CallExpression nodes, try to get the call text from the callee
  if (node.callee) {
    if (node.callee.name) {
      callName = node.callee.name;
    } else if (node.callee.property && node.callee.property.name) {
      callName = node.callee.property.name;
    }
  }
  
  // Get the function call text, prioritizing the call expression's text over assignment text
  let callText = `${callName || "function"}()`;
  
  // If this is a CallExpression with text, use that directly
  if (node.type === 'CallExpression' && node.text) {
    callText = node.text;
  } else if (node.text) {
    // Extract just the function call part from expressions like "result = calculateSum(5, 3)"
    const callMatch = node.text.match(/(\w+\s*\([^)]*\))/);
    if (callMatch) {
      callText = callMatch[1];
    } else {
      callText = node.text;
    }
  }
  ctx.add(callId, functionCallShape(callText));
  
  // Connect to previous node and set as last
  linkNext(ctx, callId);
  
  // Mark this node as a function call for later processing
  // This will help us avoid creating normal connections when we have subgraph connections
  if (!ctx.functionCallNodes) {
    ctx.functionCallNodes = new Set();
  }
  ctx.functionCallNodes.add(callId);
  
  // Store function call info for later connection creation
  if (!ctx.functionCalls) {
    ctx.functionCalls = [];
  }
  // Extract function name properly for connection matching
  // Remove parameters and return type to match function definition name
  const functionNameForConnection = callName ? callName.split('(')[0].split(' ')[0].trim() : null;
  
  ctx.functionCalls.push({
    callId: callId,
    functionName: functionNameForConnection
  });
}