/**
 * Switch statement mapping for C++ language
 */

export function mapSwitchStatement(node) {
  // Map switch statement with case structure support
  return {
    type: 'switch',
    discriminant: node.discriminant,
    cases: node.cases,
    // Add unique ID for Mermaid diagram generation
    id: `switch-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}