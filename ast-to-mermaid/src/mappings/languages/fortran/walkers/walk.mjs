export function walk(node, ctx) {
  if (!node) return;

  if (Array.isArray(node)) {
    node.forEach(child => walk(child, ctx));
    return;
  }

  // Branch-aware traversal for if nodes to wire Yes/No edges correctly
  if (node.type === 'If') {
    // First handle the if node itself to create the condition node
    if (ctx && typeof ctx.handle === 'function') {
      ctx.handle(node);
    }
    // Process then branch with proper branch handling
    if (node.then) {
      if (typeof ctx.enterBranch === 'function') ctx.enterBranch('then');
      processChildCollection(node.then, ctx);
      if (typeof ctx.exitBranch === 'function') ctx.exitBranch('then');
    }
    // Process else branch with proper branch handling
    if (node.else) {
      if (typeof ctx.enterBranch === 'function') ctx.enterBranch('else');
      processChildCollection(node.else, ctx);
      if (typeof ctx.exitBranch === 'function') ctx.exitBranch('else');
    }
    // Complete the if statement and handle joins
    if (typeof ctx.completeIf === 'function') ctx.completeIf();
    return;
  }

  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }
  
  processChildCollection(node.body, ctx);
}

function processChildCollection(collection, ctx) {
  if (!collection) return;
  if (Array.isArray(collection)) {
    collection.forEach(child => walk(child, ctx));
  } else {
    walk(collection, ctx);
  }
}