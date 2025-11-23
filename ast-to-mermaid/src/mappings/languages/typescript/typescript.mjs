/**
 * TypeScript language mapping implementation
 */

import { typescriptConfig } from './typescript-config.mjs';
import { mapTypeScriptNode } from './typescript-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapTypeScriptProgram(ast) {
  // Map the TypeScript program AST nodes
  const mappedProgram = {
    config: typescriptConfig,
    nodes: ast.body.map(mapTypeScriptNode)
  };
  
  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);
  
  return mappedProgram;
}