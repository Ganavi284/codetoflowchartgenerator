import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging default statement structure...');
console.log('=====================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for default statements
  function findDefaultStatements(node, depth = 0) {
    if (node.type === 'default_statement') {
      console.log(`${'  '.repeat(depth)}default_statement:`);
      console.log(`${'  '.repeat(depth + 1)}Text: ${node.text}`);
      console.log(`${'  '.repeat(depth + 1)}Children count: ${node.children?.length || 0}`);
      if (node.children) {
        node.children.forEach((child, index) => {
          console.log(`${'  '.repeat(depth + 2)}Child ${index}: ${child.type} - "${child.text || 'N/A'}"`);
        });
      }
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findDefaultStatements(child, depth + 1)) return true;
      }
    }
    
    return false;
  }
  
  findDefaultStatements(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}