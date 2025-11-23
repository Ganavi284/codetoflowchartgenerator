/**
 * Function declaration mapping for Fortran language
 */

export function mapFunctionDeclaration(node) {
  // Map function declaration with body support
  return {
    type: 'function',
    id: node.id,
    params: node.params,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    mermaidId: `function-${node.id.name || 'anonymous'}`
  };
}