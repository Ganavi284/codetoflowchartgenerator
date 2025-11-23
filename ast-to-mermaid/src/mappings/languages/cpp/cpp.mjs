/**
 * C++ language mapping implementation
 */

import { cppConfig } from './cpp-config.mjs';
import { mapCppNode } from './cpp-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapCppProgram(ast) {
  // Map the C++ program AST nodes
  const mappedProgram = {
    config: cppConfig,
    nodes: ast.body.map(mapCppNode)
  };
  
  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);
  
  return mappedProgram;
}