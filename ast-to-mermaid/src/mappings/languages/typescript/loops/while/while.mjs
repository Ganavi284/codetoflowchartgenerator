/**
 * While loop statement mapping for TypeScript language
 */

export function mapWhileStatement(node) {
  // Map while loop with body support
  return {
    type: 'while',
    test: node.test,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    id: `while-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}