/**
 * Python language mapping implementation
 */

import { pythonConfig } from './python-config.mjs';
import { mapPythonNode } from './python-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapPythonProgram(ast) {
  // Map the Python program AST nodes
  const mappedProgram = {
    config: pythonConfig,
    nodes: ast.body.map(mapPythonNode)
  };
  
  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);
  
  return mappedProgram;
}