/**
 * Fortran language mapping implementation
 */

import { fortranConfig } from './fortran-config.mjs';
import { mapFortranNode } from './fortran-common.mjs';
import { generateMermaidFromAST } from './mermaid/generate-mermaid.mjs';

export function mapFortranProgram(ast) {
  // Map the Fortran program AST nodes
  const mappedProgram = {
    config: fortranConfig,
    // Handle case where ast.body might not be an array
    nodes: Array.isArray(ast.body) ? ast.body.map(mapFortranNode) : 
           (ast.body && ast.body.body ? ast.body.body.map(mapFortranNode) : [])
  };
  
  // Generate Mermaid code from the AST
  mappedProgram.mermaid = generateMermaidFromAST(ast);
  
  return mappedProgram;
}