import { shapes } from '../mermaid/shapes.mjs';
import { linkNext } from '../../c/mappings/common/common.mjs';

/**
 * Map assignment statement to Mermaid flowchart nodes
 * Handles assignments that may include function calls
 * @param {Object} node - Normalized assignment node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapAssign(node, ctx) {
  if (!node || !ctx) return;

  const id = ctx.next();
  
  // Check if this assignment contains a function call
  if (node.functionCall) {
    // Create the assignment node
    ctx.add(id, shapes.box.replace('{}', node.text));
    
    // Connect to previous node
    if (ctx.last) {
      ctx.addEdge(ctx.last, id);
    }
    ctx.last = id;
    
    // Now execute the function call as part of the assignment
    // This means we need to handle the function call after the assignment node is created
    // but before we continue with the rest of the flow
    
    if (ctx.functionDefinitions) {
      const funcDef = ctx.functionDefinitions.get(node.functionCall.name);
      if (funcDef && funcDef.body) {
        console.log(`DEBUG: Executing function call: ${node.functionCall.name}`);
        
        // Save the current last node to connect back after function execution
        const savedLast = ctx.last;
        
        // Execute the function body if it's available in the context
        if (ctx.executeFunctionBody) {
          ctx.executeFunctionBody(funcDef);
        }
        
        // Restore the last node to continue with the main flow after function returns
        ctx.last = savedLast;
      }
    }
  } else {
    // Regular assignment without function call
    ctx.add(id, shapes.box.replace('{}', node.text));
    
    // Connect to previous node
    linkNext(ctx, id);
  }
}