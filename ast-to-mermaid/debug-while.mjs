import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging while statement structure...');
console.log('====================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for while_statement
  function findWhileStatement(node) {
    if (node.type === 'while_statement') {
      console.log(`While statement has ${node.children.length} children:`);
      node.children.forEach((child, index) => {
        console.log(`  ${index}: ${child.type} - ${child.text || 'N/A'}`);
      });
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findWhileStatement(child)) return true;
      }
    }
    
    return false;
  }
  
  findWhileStatement(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}