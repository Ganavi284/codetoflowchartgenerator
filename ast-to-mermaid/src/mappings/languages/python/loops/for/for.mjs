/**
 * For loop statement mapping for Python language
 */

export function mapForStatement(node) {
  // Map for loop with body support
  return {
    type: 'for',
    target: node.target,
    iter: node.iter,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    id: `for-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}