import fs from 'fs';
import { extractAST } from './src/mappings/languages/c/extractors/example-extractor.js';
import { convertAST } from './src/mappings/languages/c/pipeline/emit-mermaid.js';

// Read the complex C file
const sourceCode = fs.readFileSync('complex-example.c', 'utf8');

console.log('Testing complex C example...');
console.log('============================');

try {
  // Extract AST using the C parser
  const ast = extractAST(sourceCode, 'c');
  console.log('✓ AST extracted successfully');
  
  // Show a snippet of the AST
  console.log('\nAST snippet (first 1000 chars):');
  console.log(JSON.stringify(ast, null, 2).substring(0, 1000) + '...');
  
  // Convert AST to Mermaid
  const mermaidDiagram = convertAST(ast);
  console.log('\n✓ Mermaid diagram generated');
  
  // Save to file
  fs.writeFileSync('complex-diagram.mmd', mermaidDiagram);
  console.log('✓ Diagram saved to complex-diagram.mmd');
  
  console.log('\nNumber of nodes in diagram:', mermaidDiagram.split('\n').length - 1);
  
  // Show first 10 nodes
  console.log('\nFirst 10 nodes in diagram:');
  const lines = mermaidDiagram.split('\n');
  for (let i = 1; i <= Math.min(10, lines.length - 1); i++) {
    console.log(lines[i]);
  }
  
} catch (error) {
  console.error('Error during processing:', error.message);
  console.error('Stack:', error.stack);
}