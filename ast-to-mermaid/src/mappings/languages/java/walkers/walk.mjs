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
  
  // Handle loop components
  if (node.init) walk(node.init, ctx);
  if (node.test) walk(node.test, ctx);
  if (node.update) walk(node.update, ctx);
  if (node.body) walk(node.body, ctx);

  if (node.value) {
    // return statements
  }
}