import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

// Helper function to generate text representation of a node
function generateNodeText(node) {
  if (!node) return "IO operation";
  
  switch (node.type) {
    case 'Literal':
      return node.value;
    case 'Identifier':
      return node.name;
    case 'BinaryExpression':
      const leftText = generateNodeText(node.left);
      const rightText = generateNodeText(node.right);
      // For string concatenation
      if (node.operator === '+') {
        return `${leftText}${rightText}`;
      }
      return `${leftText} ${node.operator} ${rightText}`;
    default:
      return node.text || "IO operation";
  }
}

/**
 * Map System.out.print/println statement to Mermaid flowchart nodes
 * Creates IO node for print statements
 * @param {Object} node - Normalized print statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIoStatement(node, ctx) {
  if (!node || !ctx) return;
  
  // Create IO node for print statement
  const ioId = ctx.next();
  
  // Generate appropriate text for the IO operation
  let ioText = "IO operation";
  if (node.text) {
    ioText = node.text;
  } else if (node.expression && node.expression.callee && node.expression.callee.object && node.expression.arguments) {
    // Handle System.out.println with arguments
    const fullCallee = node.expression.callee;
    
    // Check if this is a System.out.println or similar call
    if (fullCallee.object && fullCallee.object.name === 'System' && 
        fullCallee.object.property && fullCallee.object.property.name === 'out') {
      // This is System.out.println or System.out.print
      const methodName = fullCallee.property.name; // This should be 'println' or 'print'
      const argTexts = node.expression.arguments.map(arg => generateNodeText(arg));
      ioText = `System.out.${methodName}(${argTexts.join(", ")})`;
    } else {
      // Handle other method calls
      const methodName = fullCallee.property ? fullCallee.property.name : 'call';
      const argTexts = node.expression.arguments.map(arg => generateNodeText(arg));
      ioText = `${methodName}(${argTexts.join(", ")})`;
    }
  } else if (node.arguments && node.arguments.length > 0) {
    // Handle print/println with arguments
    const argTexts = node.arguments.map(arg => generateNodeText(arg));
    const prefix = node.callee && node.callee.property ? 
                   node.callee.property.name : "print";
    ioText = `${prefix} ${argTexts.join(", ")} `;
  } else if (node.callee && node.callee.property) {
    if (node.callee.property.name === 'out') {
      ioText = "print output";
    } else if (node.callee.property.name.startsWith('next')) {
      ioText = `read ${node.callee.property.name.substring(4).toLowerCase()}`;
    }
  }
  
  ctx.add(ioId, ioShape(ioText));
  
  // Check if we're in a branch context and handle connection appropriately
  if (ctx.currentIf && ctx.currentIf() && ctx.currentIf().activeBranch) {
    // We're inside a conditional branch, use branch connection logic
    ctx.handleBranchConnection(ioId);
  } else {
    // Not in a branch, use normal sequential connection
    linkNext(ctx, ioId);
  }
  
  // Check for function calls in the arguments and create connections
  if (node.expression && node.expression.arguments) {
    // Process arguments to detect function calls recursively
    const processArguments = (args) => {
      for (const arg of args) {
        if (arg && arg.type === 'CallExpression') {
          // This is a function call
          let functionName = null;
          if (arg.callee && arg.callee.name) {
            functionName = arg.callee.name;
          } else if (arg.callee && arg.callee.property) {
            // Handle method calls like object.method()
            functionName = arg.callee.property.name;
          }
          
          if (functionName) {
            if (!ctx.functionCalls) {
              ctx.functionCalls = [];
            }
            ctx.functionCalls.push({
              callId: ioId,
              functionName: functionName
            });
          }
          
          // Recursively check arguments of nested function calls
          if (arg.arguments) {
            processArguments(arg.arguments);
          }
        }
      }
    };
    
    processArguments(node.expression.arguments);
  }
}