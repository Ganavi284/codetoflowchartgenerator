/**
 * IO function mapping for JavaScript language
 */

export function mapConsoleLog(node) {
  // Map console.log call with argument support
  return {
    type: 'io',
    function: 'console.log',
    arguments: node.arguments,
    // Add unique ID for Mermaid diagram generation
    id: `io-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}