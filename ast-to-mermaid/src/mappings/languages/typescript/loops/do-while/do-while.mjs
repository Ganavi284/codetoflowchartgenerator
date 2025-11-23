/**
 * Do-while loop statement mapping for TypeScript language
 */

export function mapDoWhileStatement(node) {
  // Map do-while loop with body support
  return {
    type: 'do-while',
    body: node.body,
    test: node.test,
    // Add unique ID for Mermaid diagram generation
    id: `do-while-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}