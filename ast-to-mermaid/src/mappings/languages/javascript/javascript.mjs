/**
 * JavaScript language mapping implementation
 */

import { javascriptConfig } from './javascript-config.mjs';
import { mapJavaScriptNode } from './javascript-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapJavaScriptProgram(ast) {
  // Map the JavaScript program AST nodes
  const mappedProgram = {
    config: javascriptConfig,
    nodes: ast.body.map(mapJavaScriptNode)
  };

  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);

  return mappedProgram;
}