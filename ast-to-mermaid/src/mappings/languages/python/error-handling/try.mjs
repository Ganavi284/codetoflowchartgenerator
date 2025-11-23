/**
 * Error handling mapping for Python language
 */

export function mapTryStatement(node) {
  // Map try statement with except and finally support
  return {
    type: 'try',
    body: node.body,
    handlers: node.handlers,
    orelse: node.orelse,
    finalbody: node.finalbody,
    // Add unique ID for Mermaid diagram generation
    id: `try-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}