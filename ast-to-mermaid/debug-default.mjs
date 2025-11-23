import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging default statement...');
console.log('============================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for default_statement
  function findDefaultStatement(node) {
    if (node.type === 'default_statement') {
      console.log(`Default statement has ${node.children.length} children:`);
      node.children.forEach((child, index) => {
        console.log(`  ${index}: ${child.type} - ${child.text || 'N/A'}`);
      });
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findDefaultStatement(child)) return true;
      }
    }
    
    return false;
  }
  
  findDefaultStatement(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}