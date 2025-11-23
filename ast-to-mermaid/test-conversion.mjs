import { convertAST } from './src/index.mjs';
import fs from 'fs';

// Read the test C file
const sourceCode = fs.readFileSync('test.c', 'utf8');

// Convert AST to Mermaid
console.log('Source code:');
console.log(sourceCode);
console.log('\nConverting to Mermaid...\n');

const mermaidDiagram = await convertAST(sourceCode, 'c');
console.log('Mermaid diagram:');
console.log(mermaidDiagram);