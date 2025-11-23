/**
 * Conditional statement mapping for Fortran language
 */

export function mapIfStatement(node) {
  // Map if statement with nested structure support
  return {
    type: 'if',
    condition: node.test,
    consequent: node.consequent,
    alternate: node.alternate,
    // Add unique ID for Mermaid diagram generation
    id: `if-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}