/**
 * Conditional statement mapping for TypeScript language
 */

export function mapIfStatement(node) {
  // Map if statement with nested structure support
  return {
    type: 'if',
    test: node.test,
    consequent: node.consequent,
    alternate: node.alternate,
    // Add unique ID for Mermaid diagram generation
    id: `if-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}