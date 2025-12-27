import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to create function call connections
function createFunctionCallConnection(ctx, callId, functionName) {
  // Store function call info for later connection creation
  if (!ctx.functionCalls) {
    ctx.functionCalls = [];
  }
  
  // Extract function name properly for connection matching
  // Remove parameters and return type to match function definition name
  const functionNameForConnection = functionName ? functionName.split('(')[0].split(' ')[0].trim() : null;
  
  ctx.functionCalls.push({
    callId: callId,
    functionName: functionNameForConnection
  });
}

/**
 * Map assignment statement to Mermaid flowchart nodes
 * Creates process node for assignment operation
 * @param {Object} node - Normalized assignment node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssignment(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for assignment
  const assignId = ctx.next();
  
  // Generate appropriate text for the assignment
  let assignText = "assignment";
  if (node.text) {
    assignText = node.text;
    
    // Check if the assignment contains a function call and create connection
    if (node.right && node.right.type === 'CallExpression') {
      const functionName = node.right.callee?.name || node.right.callee?.property?.name;
      if (functionName) {
        createFunctionCallConnection(ctx, assignId, functionName);
      }
    }
  } else if (node.left && node.right) {
    // Handle Scanner input calls
    if (node.right.type === 'CallExpression' && node.right.callee && node.right.callee.property) {
      if (node.right.callee.property.name.startsWith('next')) {
        assignText = `${node.left.name} = read ${node.right.callee.property.name.substring(4).toLowerCase()}`;
        // Create function call connection for the function call
        createFunctionCallConnection(ctx, assignId, node.right.callee.property.name);
      } else {
        assignText = `${node.left.name} = ${node.right.callee.property.name}`;
        // Create function call connection for the function call
        createFunctionCallConnection(ctx, assignId, node.right.callee.property.name);
      }
    }
    // Handle arithmetic operations
    else if (node.right.type === 'BinaryExpression') {
      const left = node.left.name || node.left.text || "var";
      const rightLeft = node.right.left ? (node.right.left.name || node.right.left.text || "expr") : "expr";
      const rightRight = node.right.right ? (node.right.right.name || node.right.right.text || "expr") : "expr";
      assignText = `${left} = ${rightLeft} ${node.right.operator} ${rightRight}`;
    } else if (node.left.name && node.right.name) {
      assignText = `${node.left.name} = ${node.right.name}`;
    } else if (node.left.name) {
      assignText = `${node.left.name} = expression`;
    }
  }
  
  ctx.add(assignId, processShape(assignText));
  
  // Connect to previous node and set as last
  // Check if we're in a branch context and handle connection appropriately
  if (ctx.currentIf && ctx.currentIf() && ctx.currentIf().activeBranch) {
    // We're inside a conditional branch, use branch connection logic
    ctx.handleBranchConnection(assignId);
  } else {
    // Not in a branch, use normal sequential connection
    linkNext(ctx, assignId);
  }
}