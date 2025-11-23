/**
 * For loop statement mapping for TypeScript language
 */

export function mapForStatement(node) {
  // Map for loop with body support
  return {
    type: 'for',
    init: node.init,
    test: node.test,
    update: node.update,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    id: `for-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}