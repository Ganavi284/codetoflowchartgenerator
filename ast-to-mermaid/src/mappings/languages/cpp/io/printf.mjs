/**
 * IO function mapping for C++ language
 */

export function mapPrintfCall(node) {
  // Map printf call with argument support
  return {
    type: 'io',
    function: 'printf',
    arguments: node.arguments,
    // Add unique ID for Mermaid diagram generation
    id: `io-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}