/**
 * Function/method declaration mapping for Java language
 * Aligns with C/C++ function handling for consistency
 */
export function mapFunctionDeclaration(node) {
  // Map function/method declaration with body support
  return {
    type: 'function',
    id: node.id,
    params: node.params,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    mermaidId: `function-${node.id.name || 'anonymous'}`
  };
}