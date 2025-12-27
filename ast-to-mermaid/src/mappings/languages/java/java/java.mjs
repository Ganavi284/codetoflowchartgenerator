/**
 * Java language mapping implementation
 */

import { javaConfig } from './java-config.mjs';
import { mapJavaNode } from './java-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapJavaProgram(ast) {
  // Map the Java program AST nodes
  const mappedProgram = {
    config: javaConfig,
    nodes: ast.body.map(mapJavaNode)
  };
  
  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);
  
  return mappedProgram;
}