/**
 * Conditional statement mapping for Python language
 */

export function mapIfStatement(node) {
  // Map if statement with nested structure support
  return {
    type: 'if',
    test: node.test,
    body: node.body,
    orelse: node.orelse,
    // Add unique ID for Mermaid diagram generation
    id: `if-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}