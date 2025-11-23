import fs from 'fs';
import { extractAST } from './src/mappings/languages/c/extractors/example-extractor.js';
import { convertAST } from './src/mappings/languages/c/pipeline/emit-mermaid.js';

// Read the test C file
const sourceCode = fs.readFileSync('test.c', 'utf8');

console.log('Source code:');
console.log(sourceCode);
console.log('\nExtracting AST...\n');

try {
  // Extract AST using the C parser
  const ast = extractAST(sourceCode, 'c');
  console.log('AST extracted successfully:');
  console.log(JSON.stringify(ast, null, 2));
  
  console.log('\nConverting to Mermaid...\n');
  
  // Convert AST to Mermaid
  const mermaidDiagram = convertAST(ast);
  console.log('Mermaid diagram:');
  console.log(mermaidDiagram);
} catch (error) {
  console.error('Error during processing:', error.message);
  console.error('Stack:', error.stack);
}