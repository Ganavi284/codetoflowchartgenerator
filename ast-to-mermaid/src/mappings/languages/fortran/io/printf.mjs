/**
 * IO function mapping for Fortran language
 */

export function mapPrintCall(node) {
  // Map print call with argument support
  return {
    type: 'io',
    function: 'print',
    arguments: node.arguments,
    // Add unique ID for Mermaid diagram generation
    id: `io-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}