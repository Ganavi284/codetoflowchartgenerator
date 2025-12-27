import { shapes } from '../mermaid/shapes.mjs';
import { linkNext } from '../mappings/common/common.mjs';

// Helper function to create function call shape with text
const functionCallShape = (text) => shapes.function.replace('{}', text);

/**
 * Map function call to Mermaid flowchart nodes
 * Creates rectangle node for function call
 * @param {Object} node - Normalized function call node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapFunctionCall(node, ctx) {
  if (!node || !ctx) return;
  
  // Create function call node
  const callId = ctx.next();
  
  // Use the full assignment text if available, otherwise fallback to function name
  const callText = node.text || `${node.name || "function"}()`;
  ctx.add(callId, functionCallShape(callText));
  
  // Connect to previous node and set as last
  if (ctx.last) {
    ctx.addEdge(ctx.last, callId);
  }
  ctx.last = callId;
  
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
  console.log('DEBUG: Storing function call - ID:', callId, 'Name:', node.name);
  ctx.functionCalls.push({
    callId: callId,
    functionName: node.name
  });
}