/**
 * IO function mapping for Python language
 */

export function mapPrintCall(node) {
  // Map print call with argument support
  return {
    type: 'io',
    function: 'print',
    args: node.args,
    // Add unique ID for Mermaid diagram generation
    id: `io-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}