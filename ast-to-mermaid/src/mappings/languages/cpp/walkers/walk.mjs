export function walk(node, ctx) {
  if (!node) return;

  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }

  if (node.type === 'If') {
    if (node.then && typeof ctx?.enterBranch === 'function') {
      ctx.enterBranch('then');
      walk(node.then, ctx);
      if (typeof ctx.exitBranch === 'function') {
        ctx.exitBranch('then');
      }
    }

    if (node.else && typeof ctx?.enterBranch === 'function') {
      ctx.enterBranch('else');
      walk(node.else, ctx);
      if (typeof ctx.exitBranch === 'function') {
        ctx.exitBranch('else');
      }
    }

    if (typeof ctx?.completeIf === 'function') {
      ctx.completeIf();
    }

    return;
  }

  if (node.type === 'Switch') {
    // Walk the switch body
    if (node.body) {
      // If the body is a Block, walk its children directly
      if (node.body.type === 'Block' && node.body.body) {
        if (Array.isArray(node.body.body)) {
          node.body.body.forEach(child => walk(child, ctx));
        } else {
          walk(node.body.body, ctx);
        }
      } else if (Array.isArray(node.body)) {
        node.body.forEach(child => walk(child, ctx));
      } else {
        walk(node.body, ctx);
      }
    }

    // Complete the switch to resolve pending breaks
    if (typeof ctx?.completeSwitch === 'function') {
      ctx.completeSwitch();
    }

    return;
  }

  // Handle Block nodes specifically to walk their body
  if (node.type === 'Block') {
    if (node.body) {
      if (Array.isArray(node.body)) {
        node.body.forEach(child => walk(child, ctx));
      } else {
        walk(node.body, ctx);
      }
    }
    return;
  }

  // Recursively walk child nodes
  // Special handling for Case and Default nodes to avoid duplicate processing
  if (node.type === 'Case' || node.type === 'Default') {
    // Process the body separately to avoid duplicate processing
    if (node.body) {
      if (Array.isArray(node.body)) {
        node.body.forEach(child => walk(child, ctx));
      } else {
        walk(node.body, ctx);
      }
    }
  } else {
    // General body processing for other node types
    if (node.body) {
      if (Array.isArray(node.body)) {
        node.body.forEach(child => walk(child, ctx));
      } else {
        walk(node.body, ctx);
      }
    }
  }
  
  if (node.then) walk(node.then, ctx);
  if (node.else) walk(node.else, ctx);
  // Note: We don't walk node.init, node.cond, node.update here
  // because they are handled by the mapping functions that create
  // decision nodes with combined text

  if (node.value) {
    // return statements
  }
}