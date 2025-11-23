/**
 * Emit Mermaid diagram from mapped nodes
 */

import { emitNode } from '../mermaid/emit-node.mjs';

export function convertAST(ast) {
  // Placeholder for Mermaid emission logic
  const diagram = ['graph TD'];
  
  // Process each node recursively
  function processNode(node) {
    if (!node) return;
    
    // Add the current node to the diagram
    diagram.push(emitNode(node));
    
    // Process children recursively
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(processNode);
    }
  }
  
  // Start processing from the root AST node
  processNode(ast);
  
  return diagram.join('\n');
}