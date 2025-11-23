/**
 * Break statement mapping for Python language
 */

export function mapBreakStatement(node) {
  // Map break statement
  return {
    type: 'break',
    // Add unique ID for Mermaid diagram generation
    id: `break-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}