import fs from 'fs';
import { extractAST } from './src/mappings/languages/c/extractors/example-extractor.js';
import { convertAST } from './src/mappings/languages/c/pipeline/emit-mermaid.js';

// Read the test C file
const sourceCode = fs.readFileSync('test.c', 'utf8');

console.log('Testing C to Mermaid conversion...');
console.log('==============================');

try {
  // Extract AST using the C parser
  const ast = extractAST(sourceCode, 'c');
  console.log('✓ AST extracted successfully');
  
  // Convert AST to Mermaid
  const mermaidDiagram = convertAST(ast);
  console.log('✓ Mermaid diagram generated');
  
  // Save to file
  fs.writeFileSync('c-diagram.mmd', mermaidDiagram);
  console.log('✓ Diagram saved to c-diagram.mmd');
  
  console.log('\nGenerated Mermaid diagram:');
  console.log('==========================');
  console.log(mermaidDiagram);
  
} catch (error) {
  console.error('Error during processing:', error.message);
  console.error('Stack:', error.stack);
}