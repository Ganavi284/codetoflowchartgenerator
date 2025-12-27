export function walk(node, ctx) {
  if (!node) return;

  // Special handling for If statements to manage branches properly
  if (node.type === 'If') {
    // Handle the if node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Walk the then branch
    if (node.then) {
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('then');
      }
      
      // If then is a block, walk its body
      if (node.then.type === 'Block' && node.then.body) {
        if (Array.isArray(node.then.body)) {
          node.then.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.then.body, ctx);
        }
      } else {
        walk(node.then, ctx);
      }
      
      if (typeof ctx?.exitBranch === 'function') {
        ctx.exitBranch('then');
      }
    }

    // Walk the else branch
    if (node.else) {
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('else');
      }
      
      // If else is a block, walk its body
      if (node.else.type === 'Block' && node.else.body) {
        if (Array.isArray(node.else.body)) {
          node.else.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.else.body, ctx);
        }
      } else {
        walk(node.else, ctx);
      }
      
      if (typeof ctx?.exitBranch === 'function') {
        ctx.exitBranch('else');
      }
    }
    
    if (typeof ctx?.completeIf === 'function') {
      ctx.completeIf();
    }

    return;
  }

  // Special handling for While statements to manage loop properly
  if (node.type === 'While') {
    // Handle the while node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Walk the body of the while loop
    if (node.body) {
      if (node.body.type === 'Block' && node.body.body) {
        if (Array.isArray(node.body.body)) {
          node.body.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.body.body, ctx);
        }
      } else {
        walk(node.body, ctx);
      }
    }
    
    // Complete the loop to connect body back to condition
    if (typeof ctx?.completeLoop === 'function') {
      ctx.completeLoop();
    }

    return;
  }

  // Special handling for For statements to manage loop properly
  if (node.type === 'For') {
    // Handle the for node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Walk the body of the for loop
    if (node.body) {
      if (node.body.type === 'Block' && node.body.body) {
        if (Array.isArray(node.body.body)) {
          node.body.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.body.body, ctx);
        }
      } else {
        walk(node.body, ctx);
      }
    }
    
    // Complete the loop to connect body back to condition
    if (typeof ctx?.completeLoop === 'function') {
      ctx.completeLoop();
    }

    return;
  }

  // Special handling for Match statements to manage switch cases properly
  if (node.type === 'Match') {
    // Handle the match node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Store the last node before the match statement
    const lastBeforeMatch = ctx.last;
    
    // Get the actual context object
    const actualCtx = typeof ctx.getContext === 'function' ? ctx.getContext() : ctx;
    
    // Track if this is a switch context
    const wasInSwitch = actualCtx.inSwitch;
    actualCtx.inSwitch = true;
    
    // Walk each case in the match statement
    if (node.cases && Array.isArray(node.cases)) {
      node.cases.forEach(caseNode => {
        walk(caseNode, ctx);
      });
    }
    
    // Reset switch context
    actualCtx.inSwitch = wasInSwitch;
    
    // Complete the switch statement
    if (typeof ctx?.completeSwitch === 'function') {
      ctx.completeSwitch();
    }
    
    return;
  }

  // Special handling for Case nodes
  if (node.type === 'Case') {
    // Handle the case node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Store the last node before processing the case body
    const lastBeforeCase = ctx.last;
    
    // Process the body separately 
    if (node.body) {
      if (Array.isArray(node.body)) {
        node.body.forEach(child => {
          // If there's a pending case condition, handle the connection when processing the first child
          if (ctx.pendingCaseCondition) {
            // Process the child node to create it
            if (ctx && typeof ctx.handle === 'function') {
              ctx.handle(child);
            }
            // Connect it to the pending condition with "Yes" label
            ctx.addEdge(ctx.pendingCaseCondition, ctx.last, "Yes");
            // Clear the pending condition
            ctx.pendingCaseCondition = null;
            // Continue walking any nested content in this child
            if (child.body) {
              if (Array.isArray(child.body)) {
                child.body.forEach(nestedChild => walk(nestedChild, ctx));
              } else {
                walk(child.body, ctx);
              }
            }
          } else {
            walk(child, ctx);
          }
        });
      } else {
        // Handle single body node
        if (ctx.pendingCaseCondition) {
          // Process the body node to create it
          if (ctx && typeof ctx.handle === 'function') {
            ctx.handle(node.body);
          }
          // Connect it to the pending condition with "Yes" label
          ctx.addEdge(ctx.pendingCaseCondition, ctx.last, "Yes");
          // Clear the pending condition
          ctx.pendingCaseCondition = null;
          // Continue walking any nested content
          if (node.body.body) {
            if (Array.isArray(node.body.body)) {
              node.body.body.forEach(nestedChild => walk(nestedChild, ctx));
            } else {
              walk(node.body.body, ctx);
            }
          }
        } else {
          walk(node.body, ctx);
        }
      }
    }
    
    // If we're in a switch context, track the end of this case
    // Get the actual context object
    const actualCtx = typeof ctx.getContext === 'function' ? ctx.getContext() : ctx;
    if (actualCtx.inSwitch && actualCtx.last && actualCtx.last !== lastBeforeCase) {
      if (!actualCtx.caseEndNodes) {
        actualCtx.caseEndNodes = [];
      }
      actualCtx.caseEndNodes.push(actualCtx.last);
    }
    
    return;
  }

  // Special handling for Function nodes
  if (node.type === 'Function') {
    // Handle the function node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // Don't walk the function body here - it will be processed separately
    // when the function is called or as part of the main program flow
    // The function body components are not individual flowchart nodes
    return;
  }

  // General body processing for other node types
  if (node.body) {
    if (Array.isArray(node.body)) {
      node.body.forEach(child => walk(child, ctx));
    } else {
      walk(node.body, ctx);
    }
  }
  
  // Note: We don't walk node.init, node.cond, node.update here
  // because they are handled by the mapping functions that create
  // decision nodes with combined text
  // Also, If, While, For, Match, and Case nodes are specially handled above
  
  // Special handling for FunctionCall nodes
  if (node.type === 'FunctionCall') {
    // Track function calls to prevent duplicate processing
    if (!ctx.processedFunctionCalls) {
      ctx.processedFunctionCalls = new Set();
    }
    
    const callKey = `${node.name}(${node.arguments ? node.arguments.join(',') : ''})`;
    if (ctx.processedFunctionCalls.has(callKey)) {
      // Already processed this function call, skip to avoid duplicates
      if (ctx && typeof ctx.handle === 'function') {
        ctx.handle(node);
      }
      return;
    }
    
    ctx.processedFunctionCalls.add(callKey);
    
    // Handle the function call node itself first
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    
    // If there's a context with function definitions, try to execute the function body in a subgraph
    if (ctx.getContext && typeof ctx.getContext === 'function') {
      const actualCtx = ctx.getContext();
      if (actualCtx && actualCtx.functionDefinitions) {
        const funcDef = actualCtx.functionDefinitions.get(node.name);
        if (funcDef && funcDef.body) {
          console.log(`DEBUG: Function call executing function body - Name: ${node.name}`);
          
          // Execute the function body in a subgraph
          if (typeof actualCtx.executeFunctionBody === 'function') {
            const subgraphId = actualCtx.executeFunctionBody(funcDef, node.name);
            
            // Create a connection between the function call and the subgraph
            if (subgraphId && ctx.last) {
              console.log(`DEBUG: Function call ${node.name} should connect to subgraph ${subgraphId}`);
              // Add a special connection between the function call and the subgraph
              // In Mermaid, we'll add an edge from the function call to the subgraph
              actualCtx.addEdge(ctx.last, subgraphId);
            }
          }
        }
      }
    }
    return;
  }
  
  // For other nodes, handle them with the general handler
  if (node.type !== 'If' && node.type !== 'While' && node.type !== 'For' && node.type !== 'Match' && node.type !== 'Case' && node.type !== 'FunctionCall') {
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
  }
  
  if (node.value) {
    // return statements
  }
}