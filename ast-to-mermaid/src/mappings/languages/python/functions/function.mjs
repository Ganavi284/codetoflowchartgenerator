/**
 * Function declaration mapping for Python language
 */

export function mapFunctionDef(node) {
  // Map function declaration with body support
  return {
    type: 'function',
    name: node.name,
    args: node.args,
    body: node.body,
    // Add unique ID for Mermaid diagram generation
    mermaidId: `function-${node.name || 'anonymous'}`
  };
}