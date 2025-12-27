export function walk(node, ctx) {
  if (!node) return;
  
  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    // Don't handle Block nodes directly - only process their contents
    if (node.type !== 'Block') {
      ctx.handle(node);
    }
    
    // If we're inside a loop body, handle the connection appropriately
    // Don't apply this to Block nodes since they're containers for other statements
    if (typeof ctx?.handleLoopConnection === 'function' && ctx.currentLoop && ctx.currentLoop() && 
        !ctx.inRepeatUntilBody && node.type !== 'Block') {
      // Use the loop connection handling instead of default connection
      // The handleLoopConnection will properly connect with "Yes" label for first node in body
      ctx.handleLoopConnection(ctx.last);
    } else if (typeof ctx?.inRepeatUntilBody === 'boolean' && ctx.inRepeatUntilBody && node.type !== 'Block') {
      // For repeat-until, we handle connections differently
      // We don't want the default connection from condition to body
      // The connection from body to condition is handled after processing the body
      // We don't call any connection method here to prevent the default connection
    } else if (node.type !== 'Block') {
      // For non-loop nodes and other loop types, use default connection logic
      // The mapping functions handle connections for non-loop nodes
    }
  }

  // Special handling for Expr nodes that contain case body text
  // These need to be parsed into separate statements
  if (node.type === 'Expr' && node.text) {
    // Check if this is a case body that contains complex statements
    const trimmedText = node.text.trim();
    if (trimmedText.startsWith('begin') && trimmedText.includes('end')) {
      // This is a complex case body, we need to parse it into separate statements
      // For now, we'll treat it as a single node but ensure proper flow
      // In a more advanced implementation, we would parse this into separate statements
    }
  }

  // Handle loop completion for loop nodes
  if (node.type === 'For' || node.type === 'While' || node.type === 'RepeatUntil') {
    // Store current loop context information
    const isForLoop = node.type === 'For';
    const isWhileLoop = node.type === 'While';
    const isRepeatUntil = node.type === 'RepeatUntil';
    
    if (isRepeatUntil) {
      // For repeat-until, the flow is different: body executes first, then condition is checked
      // Get the node that was before the condition (stored in the loop info)
      const currentLoop = ctx.pendingLoops && ctx.pendingLoops[ctx.pendingLoops.length - 1];
      const nodeBeforeLoop = currentLoop?.nodeBeforeCondition;
      
      if (node.body) {
        // Temporarily set ctx.last to the node before the loop so the first body statement
        // connects to the right node instead of to the condition
        const originalLast = ctx.last;
        
        // Enter repeat-until loop body context to handle connections specially
        if (typeof ctx?.enterRepeatUntilLoopBody === 'function' && currentLoop && currentLoop.loopId) {
          ctx.enterRepeatUntilLoopBody(currentLoop.loopId);
        }
        
        if (Array.isArray(node.body)) {
          node.body.forEach(child => walk(child, ctx));
        } else {
          // For the first statement, temporarily set the last to the node before the loop
          ctx.last = nodeBeforeLoop;
          walk(node.body, ctx);
          // Restore the original last for subsequent processing
          ctx.last = originalLast;
        }
        
        // Exit loop body context
        if (typeof ctx?.exitLoopBody === 'function') {
          ctx.exitLoopBody();
        }
      }
      
      // Now connect the body end back to the condition (this forms the loop)
      if (ctx.last && currentLoop?.loopId && ctx.last !== currentLoop.loopId) {
        // Connect the end of the body back to the condition
        ctx.addEdge(ctx.last, currentLoop.loopId);
      }
      
      // Complete the loop - this will handle the "No" branch (continue loop) and "Yes" branch (exit)
      if (typeof ctx?.completeLoop === 'function') {
        ctx.completeLoop();
      }
    } else {
      // For For and While loops, use the loop body context
      if (node.body) {
        // Enter loop body context to handle "Yes" branch connection
        if (typeof ctx?.enterLoopBody === 'function' && ctx.pendingLoops && ctx.pendingLoops.length > 0) {
          const currentLoop = ctx.pendingLoops[ctx.pendingLoops.length - 1];
          if (currentLoop && currentLoop.loopId) {
            ctx.enterLoopBody(currentLoop.loopId);
          }
        }
        
        if (Array.isArray(node.body)) {
          node.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.body, ctx);
        }
        
        // Exit loop body context
        if (typeof ctx?.exitLoopBody === 'function') {
          ctx.exitLoopBody();
        }
      }
      
      // Complete the loop to resolve connections back to loop condition
      if (typeof ctx?.completeLoop === 'function') {
        ctx.completeLoop();
      }
    }

    return;
  }

  // Process node bodies for all node types, not just specific ones
  // Skip body processing for Case, CaseOption, and ElseCase nodes since they're handled specially
  if (node.body && node.type !== 'Case' && node.type !== 'CaseOption' && node.type !== 'ElseCase') {
    if (Array.isArray(node.body)) {
      node.body.forEach(child => walk(child, ctx));
    } else {
      walk(node.body, ctx);
    }
  }
  
  // Special handling for If nodes to process then and else branches
  if (node.type === 'If') {
    if (node.then) {
      // Process then branch
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('then');
        walk(node.then, ctx);
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('then');
        }
      }
    }
    
    if (node.else) {
      // Process else branch
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('else');
        // Check if the else branch is a Block containing an If statement
        // This handles if-else-if chains where the else branch is wrapped in a Block
        if (node.else.type === 'Block' && 
            node.else.body && 
            Array.isArray(node.else.body) && 
            node.else.body.length === 1 && 
            (node.else.body[0].type === 'If' || node.else.body[0].type === 'IfElse')) {
          // Process the if statement directly without wrapping it in another block context
          walk(node.else.body[0], ctx);
        } else {
          walk(node.else, ctx);
        }
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('else');
        }
      }
    }
    
    // Complete the if statement
    if (typeof ctx?.completeIf === 'function') {
      ctx.completeIf();
    }
  }
  
  // Special handling for IfElse nodes to process then and else branches
  if (node.type === 'IfElse') {
    if (node.then) {
      // Process then branch
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('then');
        walk(node.then, ctx);
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('then');
        }
      }
    }
    
    if (node.else) {
      // Process else branch
      if (typeof ctx?.enterBranch === 'function') {
        ctx.enterBranch('else');
        // Check if the else branch is a Block containing an If statement
        // This handles if-else-if chains where the else branch is wrapped in a Block
        if (node.else.type === 'Block' && 
            node.else.body && 
            Array.isArray(node.else.body) && 
            node.else.body.length === 1 && 
            (node.else.body[0].type === 'If' || node.else.body[0].type === 'IfElse')) {
          // Process the if statement directly without wrapping it in another block context
          walk(node.else.body[0], ctx);
        } else {
          walk(node.else, ctx);
        }
        if (typeof ctx.exitBranch === 'function') {
          ctx.exitBranch('else');
        }
      }
    }
    
    // Complete the if statement
    if (typeof ctx?.completeIf === 'function') {
      ctx.completeIf();
    }
  }
  
  // Special handling for Case nodes to process case options
  if (node.type === 'Case') {
    // Process the body of the case statement (case options)
    if (node.body) {
      if (Array.isArray(node.body)) {
        // Process all case options first, keeping track of a separate context for case end nodes
        const caseOptionEndNodes = [];
        
        for (const option of node.body) {
          if (option.type === 'ElseCase') {
            // Process else case separately after all options
            continue;
          }
          walk(option, ctx);
        }
        
        // Now process the else case (if it exists) with a clean context state
        for (const option of node.body) {
          if (option.type === 'ElseCase') {
            // Store current context state
            const savedLast = ctx.last;
            // Process the else case
            walk(option, ctx);
            // Restore context state after else case processing
            ctx.last = savedLast;
            break;
          }
        }
      } else {
        walk(node.body, ctx);
      }
    }
    
    // Complete the case statement to connect all branches
    if (typeof ctx?.completeCase === 'function') {
      ctx.completeCase();
    }
    
    // Return early to avoid double processing the body
    return;
  }
  
  // Special handling for CaseOption and ElseCase nodes to track their end nodes
  if (node.type === 'CaseOption' || node.type === 'ElseCase') {
    // Store the previous last node before processing
    const previousLast = ctx.last;
    
    // For CaseOption nodes, we need to track the option ID to connect it to its body
    let caseOptionId = null;
    if (node.type === 'CaseOption') {
      // The case option label should have been added by the mapper
      // We need to get its ID to connect it to the body
      caseOptionId = ctx.last; // This should be the case option label node
    }
    
    // Process the body of the case option/else only if it hasn't been combined
    if (node.body && !node.bodyCombined) {
      // Before processing the body, save the current case context
      // so we can restore it after processing nested control structures
      const originalLast = ctx.last;
      
      walk(node.body, ctx);
      
      // If this is a CaseOption, connect the option label to its body
      // This connection is now handled by the IO mapping function, so we don't need to add it here
      // if (node.type === 'CaseOption' && caseOptionId && ctx.last && ctx.last !== caseOptionId) {
      //   // Add an edge from the case option label to its body
      //   ctx.addEdge(caseOptionId, ctx.last);
      // }
      
      // Track the end node of this case branch with the current case statement
      if (ctx.last && ctx.last !== originalLast) {
        if (typeof ctx.addCaseEndNode === 'function') {
          ctx.addCaseEndNode(ctx.last);
        }
      }
      
      // After processing a case option body, we shouldn't automatically connect to the next node
      // Set ctx.last to null to prevent automatic connections that might interfere with else case
      if (node.type === 'CaseOption') {
        ctx.last = originalLast; // Restore to the case option label, not the end of the body
      }
    } else if (node.bodyCombined) {
      // If the body has been combined, the case option node itself is the end node
      // Since we've already processed the mapping function, ctx.last should be set to the option node
      if (typeof ctx.addCaseEndNode === 'function' && ctx.last) {
        ctx.addCaseEndNode(ctx.last);
      }
      
      // After processing a case option body, we shouldn't automatically connect to the next node
      if (node.type === 'CaseOption') {
        // Keep ctx.last as the case option node to prevent interference
      }
    } else {
      // If there's no body (for ElseCase), just add the current last node as a case end node
      if (node.type === 'ElseCase' && ctx.last) {
        if (typeof ctx.addCaseEndNode === 'function') {
          ctx.addCaseEndNode(ctx.last);
        }
      }
    }
  }

  // Handle then and else properties directly (for normalized nodes)
  // Skip then/else processing for If and IfElse nodes since they're handled specially
  if (node.then && node.type !== 'If' && node.type !== 'IfElse') {
    walk(node.then, ctx);
  }
  if (node.else && node.type !== 'If' && node.type !== 'IfElse') {
    walk(node.else, ctx);
  }

  // Note: We don't walk node.init, node.cond, node.update here
  // because they are handled by the mapping functions that create
  // decision nodes with combined text

  if (node.value) {
    // return statements
  }
}