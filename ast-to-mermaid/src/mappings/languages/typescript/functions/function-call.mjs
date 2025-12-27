import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create function call shape with text
const functionCallShape = (text) => shapes.function.replace('{}', text);

/**
 * Map TypeScript function call to Mermaid flowchart nodes
 * Creates double rectangle node for function call
 * @param {Object} node - Normalized function call node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionCall(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function call node
  const callId = ctx.next();
  
  // Extract the function call part from the assignment or direct call
  let callText = "function()";
  if (node.text) {
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
  
  // Store function call info for later connection creation
  if (!ctx.functionCalls) {
    ctx.functionCalls = [];
  }
  // Extract function name properly for connection matching
  // Remove parameters and return type to match function definition name
  let functionNameForConnection = null;
  if (node.text) {
    // Extract function name from the text like "result = calculateSum(5, 3)" or "calculateSum(5, 3)"
    const funcNameMatch = node.text.match(/(\w+)\s*\(/);
    if (funcNameMatch) {
      functionNameForConnection = funcNameMatch[1].trim();
    }
  }
  
  ctx.functionCalls.push({
    callId: callId,
    functionName: functionNameForConnection
  });
}