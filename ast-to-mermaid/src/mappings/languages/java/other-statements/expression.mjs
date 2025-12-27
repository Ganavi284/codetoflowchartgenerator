import { shapes } from "../mermaid/shapes.mjs";
import { linkNext } from "../mappings/common/common.mjs";
import { mapIoStatement } from "../io/io.mjs";

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

// Helper function to create IO shape with text
const ioShape = (text) => shapes.io.replace('{}', text);

// Helper function to generate text representation of a node
function generateNodeText(node) {
  if (!node) return "expression";
  
  switch (node.type) {
    case 'Literal':
      // Remove quotes from string literals
      if (typeof node.value === 'string') {
        return node.value;
      }
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
      return node.text || "expression";
  }
}

/**
 * Map expression statement to Mermaid flowchart nodes
 * Creates process node for expression evaluation
 * @param {Object} node - Normalized expression node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapExpr(node, ctx) {
  if (!node || !ctx) return;
  
  // Check if this is a System.out.print/println statement
  if (node.expression && node.expression.type === 'CallExpression' &&
      node.expression.callee && node.expression.callee.object && 
      node.expression.callee.object.name === 'System' &&
      node.expression.callee.property && 
      (node.expression.callee.property.name === 'out')) {
    // Create IO node directly for System.out statements
    const ioId = ctx.next();
    
    // Generate appropriate text for the IO operation
    let ioText = "print output";
    if (node.expression.arguments && node.expression.arguments.length > 0) {
      // Handle print/println with arguments
      const argTexts = node.expression.arguments.map(arg => generateNodeText(arg));
      
      // Use the full expression text if available (this should contain the full System.out.println call)
      if (node.expression.text && node.expression.text.includes('System.out')) {
        ioText = node.expression.text;
      } else {
        // For System.out.println, we need to detect the full method chain
        const fullCallee = node.expression.callee;
        let methodName = 'println'; // default
        
        // Check if this is a System.out.println or similar call
        if (fullCallee.object && fullCallee.object.name === 'System' && 
            fullCallee.object.property && fullCallee.object.property.name === 'out') {
          // This is System.out.println or System.out.print
          methodName = fullCallee.property.name; // This should be 'println' or 'print'
          ioText = `System.out.${methodName}(${argTexts.join(", ")})`;
        } else if (fullCallee.property && fullCallee.property.name) {
          // For other method calls
          methodName = fullCallee.property.name;
          ioText = `${methodName}(${argTexts.join(", ")})`;
        } else if (node.expression.text) {
          // Fallback to extract from text if property name is not available
          const match = node.expression.text.match(/\.([a-zA-Z]+)\(/);
          if (match) {
            methodName = match[1];
            ioText = node.expression.text;
          }
        }
      }
    } else if (node.expression.text) {
      // Try to extract method name from text
      if (node.expression.text.startsWith('print')) {
        ioText = node.expression.text.substring(6); // Remove "print " prefix
      } else if (node.expression.text.startsWith('println')) {
        ioText = node.expression.text.substring(8); // Remove "println " prefix
      } else {
        ioText = node.expression.text.replace(/\r\n/g, ' ').replace(/\n/g, ' ');
      }
    }
    
    // For System.out.println calls, try to get the full expression including function calls in arguments
    if (node.expression && node.expression.callee && 
        node.expression.callee.object && node.expression.callee.object.name === 'System' &&
        node.expression.callee.property && node.expression.callee.property.name === 'out') {
      
      // Reconstruct the full call including arguments
      if (node.expression.arguments) {
        const argTexts = [];
        for (const arg of node.expression.arguments) {
          if (arg && arg.text) {
            argTexts.push(arg.text);
          } else if (arg && arg.type === 'CallExpression' && arg.callee && arg.callee.name) {
            // For function calls, try to reconstruct as "functionName(args)"
            let callText = arg.callee.name;
            if (arg.arguments && arg.arguments.length > 0) {
              const argValues = arg.arguments.map(a => a.value !== undefined ? a.value : a.text || 'arg').join(', ');
              callText += `(${argValues})`;
            } else {
              callText += '()';
            }
            argTexts.push(callText);
          }
        }
        if (argTexts.length > 0) {
          ioText = `System.out.println(${argTexts.join(', ')})`;
        }
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
    
    return;
  }
  
  // Handle CallExpression that is not System.out (user-defined function calls)
  if (node.expression && node.expression.type === 'CallExpression') {
    // Import mapFunctionCall here to avoid circular dependencies
    // Since we're in the expression file, we need to call the function mapping logic
    // by directly calling the logic that mapFunctionCall would do
    
    // Create function call node
    const callId = ctx.next();
    
    const callName = node.expression.name || node.expression.callee?.name || node.expression.callee?.property?.name;
    // Use the full assignment text if available, otherwise fallback to function name
    // Extract the function call part from the assignment or direct call
    let callText = `${callName || "function"}()`;
    // First try to get the text from the CallExpression itself (nested in the expression)
    if (node.expression && node.expression.type === 'CallExpression' && node.expression.text) {
      callText = node.expression.text;
    } else if (node.text) {
      // If not found in the CallExpression, try to extract from the assignment text
      const callMatch = node.text.match(/(\w+\s*\([^)]*\))/);
      if (callMatch) {
        callText = callMatch[1];
      } else {
        callText = node.text;
      }
    }
    
    // Use the function shape
    const functionCallShape = shapes.function.replace('{}', callText);
    ctx.add(callId, functionCallShape);
    
    // Connect to previous node and set as last
    linkNext(ctx, callId);
    
    // Mark this node as a function call for later processing
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
    
    return;
  }
  
  // Create process node for other expressions
  const exprId = ctx.next();
  
  // Generate appropriate text for the expression
  let exprText = "expression";
  
  // Try to get text from the node first
  if (node.text) {
    exprText = node.text;
  }
  // Handle binary expressions (arithmetic operations)
  else if (node.expression && node.expression.type === 'BinaryExpression') {
    const left = node.expression.left ? (node.expression.left.name || node.expression.left.text || "expr") : "expr";
    const right = node.expression.right ? (node.expression.right.name || node.expression.right.text || "expr") : "expr";
    exprText = `${left} ${node.expression.operator} ${right}`;
  }
  // Handle comment-like expressions that start with //
  else if (node.expression && node.expression.type === 'Literal' && node.expression.value && node.expression.value.startsWith('//')) {
    // Skip comment expressions by returning early
    return; // Skip comment nodes
  }
  // Handle condition expressions that are just parentheses content like (a > 5)
  else if (node.expression && node.expression.type === 'Literal' && node.expression.value && node.expression.value.startsWith('(') && node.expression.value.endsWith(')')) {
    // Skip condition expressions that are just the parentheses content
    // These are extracted from if statements and should not be shown as separate nodes
    return; // Skip condition content nodes
  }
  // Handle other literal expressions
  else if (node.expression && node.expression.type === 'Literal' && node.expression.value) {
    exprText = node.expression.value;
  }
  
  // Use process shape for general expressions
  const shape = processShape(exprText);
  
  ctx.add(exprId, shape);
  
  // Connect to previous node and set as last
  // Check if we're in a branch context and handle connection appropriately
  if (ctx.currentIf && ctx.currentIf() && ctx.currentIf().activeBranch) {
    // We're inside a conditional branch, use branch connection logic
    ctx.handleBranchConnection(exprId);
  } else {
    // Not in a branch, use normal sequential connection
    linkNext(ctx, exprId);
  }
}