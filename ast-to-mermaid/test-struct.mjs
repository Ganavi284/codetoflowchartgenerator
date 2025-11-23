import fs from 'fs';
import { extractAST } from './src/mappings/languages/c/extractors/example-extractor.js';
import { convertAST } from './src/mappings/languages/c/pipeline/emit-mermaid.js';

// Read the struct C file
const sourceCode = fs.readFileSync('struct-example.c', 'utf8');

console.log('Testing struct C example...');
console.log('==========================');

try {
  // Extract AST using the C parser
  const ast = extractAST(sourceCode, 'c');
  console.log('✓ AST extracted successfully');
  
  // Convert AST to Mermaid
  const mermaidDiagram = convertAST(ast);
  console.log('✓ Mermaid diagram generated');
  
  // Save to file
  fs.writeFileSync('struct-diagram.mmd', mermaidDiagram);
  console.log('✓ Diagram saved to struct-diagram.mmd');
  
  console.log('\nNumber of nodes in diagram:', mermaidDiagram.split('\n').length - 1);
  
  // Show some key nodes
  console.log('\nKey nodes in diagram:');
  const lines = mermaidDiagram.split('\n');
  const keyNodes = lines.filter(line => 
    line.includes('struct') || 
    line.includes('typedef') || 
    line.includes('enum') ||
    line.includes('pointer') ||
    line.includes('array')
  );
  
  keyNodes.slice(0, 10).forEach((node, index) => {
    console.log(`${index + 1}: ${node}`);
  });
  
} catch (error) {
  console.error('Error during processing:', error.message);
  console.error('Stack:', error.stack);
}