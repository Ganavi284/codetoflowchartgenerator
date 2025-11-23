export function walk(node, ctx) {
  if (!node) return;

  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
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