export function walk(node, ctx) {
  if (!node) return;

  if (Array.isArray(node)) {
    node.forEach(child => walk(child, ctx));
    return;
  }

  if (ctx && typeof ctx.handle === 'function') {
    ctx.handle(node);
  }

  processChildCollection(node.body, ctx);
  processChildCollection(node.then, ctx);
  processChildCollection(node.else, ctx);
}

function processChildCollection(collection, ctx) {
  if (!collection) return;
  if (Array.isArray(collection)) {
    collection.forEach(child => walk(child, ctx));
  } else {
    walk(collection, ctx);
  }
}