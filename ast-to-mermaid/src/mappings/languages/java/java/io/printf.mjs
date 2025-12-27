/**
 * IO function mapping for Java language
 */

export function mapSystemOutPrint(node) {
  // Map System.out.print* call with argument support
  return {
    type: 'io',
    function: 'System.out',
    arguments: node.arguments,
    // Add unique ID for Mermaid diagram generation
    id: `io-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}