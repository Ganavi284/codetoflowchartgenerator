import { shapes } from '../mermaid/shapes.mjs';
import { linkNext } from '../../c/mappings/common/common.mjs';

/**
 * Map I/O statement to Mermaid flowchart nodes
 * Handles I/O operations that may include function calls
 * @param {Object} node - Normalized I/O node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapIO(node, ctx) {
  if (!node || !ctx) return;

  const id = ctx.next();
  
  // Check if this I/O operation contains an inner function call
  if (node.innerFunctionCall) {
    // Create the I/O node with the full text
    ctx.add(id, shapes.parallelogram.replace('{}', node.text));
    
    // Connect to previous node
    if (ctx.last) {
      ctx.addEdge(ctx.last, id);
    }
    ctx.last = id;
    
    // Execute the inner function call if function definitions are available
    if (ctx.functionDefinitions) {
      const funcDef = ctx.functionDefinitions.get(node.innerFunctionCall.name);
      if (funcDef && funcDef.body) {
        console.log(`DEBUG: I/O operation contains function call: ${node.innerFunctionCall.name}`);
        
        // Execute the function body in a subgraph if executeFunctionBody method exists
        if (typeof ctx.executeFunctionBody === 'function') {
          const subgraphId = ctx.executeFunctionBody(funcDef, node.innerFunctionCall.name);
          
          // Optionally connect the I/O node to the subgraph
          if (subgraphId) {
            console.log(`DEBUG: Created subgraph ${subgraphId} for function ${node.innerFunctionCall.name}`);
          }
        }
      }
    }
  } else {
    // Regular I/O operation without function call
    ctx.add(id, shapes.parallelogram.replace('{}', node.text));
    
    // Connect to previous node
    linkNext(ctx, id);
  }
}