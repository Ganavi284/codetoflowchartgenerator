import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging switch body structure...');
console.log('================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for switch_statement and examine its body
  function findSwitchBody(node) {
    if (node.type === 'switch_statement') {
      console.log(`Switch statement body (compound_statement) has ${node.children[2].children.length} children:`);
      node.children[2].children.forEach((child, index) => {
        console.log(`  ${index}: ${child.type} - ${child.text || 'N/A'}`);
      });
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findSwitchBody(child)) return true;
      }
    }
    
    return false;
  }
  
  findSwitchBody(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}