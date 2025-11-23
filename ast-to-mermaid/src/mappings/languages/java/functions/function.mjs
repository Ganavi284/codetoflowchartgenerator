/**
 * Method declaration mapping for Java language
 */

export function mapMethodDeclaration(node) {
  // Map method declaration with body support
  return {
    type: 'method',
    id: node.id,
    name: node.name,
    params: node.params,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    mermaidId: `method-${node.name || 'anonymous'}`
  };
}