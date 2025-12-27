export function walk(node, ctx) {
  if (!node) return;
  
  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
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
    const isForLoop = node.type === 'For';
    const isWhileLoop = node.type === 'While';
    const isRepeatUntil = node.type === 'RepeatUntil';
    
    // Store current loop context information
    let originalLast = ctx.last;
    
    // For Repeat-Until loops, we need to track the first body node to connect back from condition
    let firstBodyNode = null;
    
    // Walk the loop body first
    if (node.body) {
      // Set a flag to indicate we're processing loop body
      const originalInLoop = ctx.inLoop;
      ctx.inLoop = true;
      
      // For Repeat-Until, we need to track the first node of the body
      // We'll use the handleLoopBodyConnection mechanism instead of creating a dummy node
      if (isRepeatUntil && ctx.currentLoopCondId) {
        // Mark that we're in a loop context with a condition
        ctx.inLoopWithCondition = true;
      }
      
      // For While and For loops, we need to track when we're in a loop context
      // so that the first body node connects from the condition with 'Yes' label
      if ((isWhileLoop || isForLoop) && ctx.currentLoopCondId) {
        // Mark that we're in a loop context with a condition
        ctx.inLoopWithCondition = true;
      }
      
      // If the body is a block, we need to process its contents individually
      if (node.body.type === 'Block' && node.body.body && Array.isArray(node.body.body)) {
        // Process each statement in the block individually
        node.body.body.forEach(child => walk(child, ctx));
      } else if (Array.isArray(node.body)) {
        node.body.forEach(child => walk(child, ctx));
      } else {
        walk(node.body, ctx);
      }
      
      // Restore the original inLoop value
      ctx.inLoop = originalInLoop;
      ctx.inLoopWithCondition = false;
    }
    
    // For For loops, create the increment node and connect the loop structure
    if (isForLoop) {
      // Create increment node
      const incrementId = ctx.next();
      const incrementText = node.update?.text || 'increment';
      
      // Add the increment node using a simple format since we can't import shapes here
      ctx.add(incrementId, `[${incrementText}]`);
      
      // Connect the last node (which should be the body) to the increment
      if (ctx.last) {
        ctx.addEdge(ctx.last, incrementId);
      }
      
      // Find the condition node from the pending loops to connect the increment back to it
      if (ctx.pendingLoops && ctx.pendingLoops.length > 0) {
        const currentLoop = ctx.pendingLoops[ctx.pendingLoops.length - 1];
        if (currentLoop && currentLoop.type === 'for' && currentLoop.loopId) {
          // Connect increment back to condition to form the loop
          ctx.addEdge(incrementId, currentLoop.loopId);
          // Update the incrementId in the loop info
          currentLoop.incrementId = incrementId;
        }
      }
    } else if (isWhileLoop) {
      // For While loops, the body should connect back to the condition
      // The first body node should already be connected to the condition with 'Yes' label
      // through the handleLoopBodyConnection mechanism
      
      // If there's a body and we're processing it, ensure the last body node connects back to condition
      if (ctx.currentLoopCondId && ctx.last) {
        // Connect the last body node back to the condition to form the loop
        ctx.addEdge(ctx.last, ctx.currentLoopCondId);
      }
    }
    
    // For Repeat-Until loops, the connection from condition to body is handled in handleLoopBodyConnection
    if (isRepeatUntil) {
      // The connection from condition to body is handled in the context through handleLoopBodyConnection
      // The condition node is already connected to the first body node with 'No' label
    }
    
    // For While loops, the first body node should connect from the condition with 'Yes' label
    if (isWhileLoop) {
      // The connection is handled in the context through handleLoopBodyConnection
    }
    
    // Complete the loop to resolve connections back to loop condition
    if (typeof ctx?.completeLoop === 'function') {
      ctx.completeLoop();
    }

    return;
  }

  // Process node bodies for all node types, not just specific ones
  // Skip body processing for Case, CaseOption, and ElseCase nodes since they're handled specially
  // Also skip for Loop types (For, While, RepeatUntil) since they're handled specifically above
  if (node.body && node.type !== 'Case' && node.type !== 'CaseOption' && node.type !== 'ElseCase' && 
      node.type !== 'For' && node.type !== 'While' && node.type !== 'RepeatUntil') {
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