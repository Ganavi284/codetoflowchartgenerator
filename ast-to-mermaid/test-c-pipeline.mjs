import fs from 'fs';
import { convertAST } from './src/mappings/languages/c/pipeline/emit-mermaid.js';

// Read the test C file
const sourceCode = fs.readFileSync('test.c', 'utf8');

console.log('Source code:');
console.log(sourceCode);
console.log('\nConverting to Mermaid...\n');

// For now, let's create a mock AST since we don't have the actual C parser integrated yet
const mockAST = {
  type: 'Program',
  body: [
    { type: 'Include', label: 'stdio.h' },
    { type: 'Function', label: 'main' },
    { type: 'Statement', label: 'printf' },
    { type: 'Return', label: '0' }
  ]
};

const mermaidDiagram = convertAST(mockAST);
console.log('Mermaid diagram:');
console.log(mermaidDiagram);