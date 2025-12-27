export function walk(node, ctx) {
  if (!node) return;

  // Use the safeVisit function to prevent duplicate processing of nodes
  const id = `${node.type}-${node.start}-${node.end}`;
  if (ctx.visited && ctx.visited.has(id)) return;
  if (ctx.visited) ctx.visited.add(id);

  // Handle the current node
  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }

  // Special handling for different node types
  if (node.type === 'ForStatement' || node.type === 'WhileStatement' || node.type === 'DoWhileStatement') {
    // For loop statements, we handle the full processing in the pipeline
    // Don't walk body here to avoid duplicate processing
  } else if (node.type === 'Case' || node.type === 'Default') {
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
  
  // For loop statements, don't process init/test/update components in the walker
  // These are handled by the pipeline functions
  if (node.type !== 'ForStatement' && node.type !== 'WhileStatement' && node.type !== 'DoWhileStatement') {
    // Handle loop components for non-loop nodes
    if (node.init) walk(node.init, ctx);
    if (node.test) walk(node.test, ctx);
    if (node.update) walk(node.update, ctx);
  }
  


  

  if (node.value) {
    // return statements
  }
}