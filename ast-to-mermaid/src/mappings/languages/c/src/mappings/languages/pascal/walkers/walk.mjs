// Walker for normalized Pascal AST nodes

export function walk(node, ctx) {
  if (!node) return;

  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }

  // Special handling for If nodes - the mapper handles branch registration
  // We just need to walk the body of the branches, not the branches themselves
  if (node.type === 'If') {
    // The if mapper has already registered the if statement with the context
    // We just walk the contents of the branches
    
    // Process then branch contents
    if (node.then) {
      if (typeof ctx?.enterBranch === 'function') {
        console.log('Entering then branch');
        ctx.enterBranch('then');
        // Walk the contents of the then branch
        if (node.then.body && Array.isArray(node.then.body)) {
          node.then.body.forEach(child => {
            if (child) {
              walk(child, ctx);
            }
          });
        }
        if (typeof ctx.exitBranch === 'function') {
          console.log('Exiting then branch');
          ctx.exitBranch('then');
        }
      }
    }
    
    // Process else branch contents if it exists
    if (node.else) {
      if (typeof ctx?.enterBranch === 'function') {
        console.log('Entering else branch');
        ctx.enterBranch('else');
        // Walk the contents of the else branch
        if (node.else.body && Array.isArray(node.else.body)) {
          node.else.body.forEach(child => {
            if (child) {
              walk(child, ctx);
            }
          });
        }
        if (typeof ctx.exitBranch === 'function') {
          console.log('Exiting else branch');
          ctx.exitBranch('else');
        }
      }
    }
    
    // Complete the if statement
    if (typeof ctx?.completeIf === 'function') {
      console.log('Completing if statement');
      ctx.completeIf();
    }
    
    return;
  }
  
  // Handle Block nodes
  if (node.type === 'Block') {
    // Process Block nodes by walking their body
    if (node.body && Array.isArray(node.body)) {
      node.body.forEach(child => {
        if (child) {
          walk(child, ctx);
        }
      });
    }
    return;
  }
  
  // Handle Program nodes
  if (node.type === 'Program') {
    // Process Program nodes by walking their body
    if (node.body && Array.isArray(node.body)) {
      node.body.forEach(child => {
        if (child) {
          walk(child, ctx);
        }
      });
    }
    return;
  }
}