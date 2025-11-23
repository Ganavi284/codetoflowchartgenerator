import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging switch statement children...');
console.log('==================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for switch statements and examine their children
  function findSwitchStatements(node, depth = 0) {
    if (node.type === 'switch_statement') {
      console.log(`${'  '.repeat(depth)}switch_statement:`);
      console.log(`${'  '.repeat(depth + 1)}Text: ${node.text}`);
      console.log(`${'  '.repeat(depth + 1)}Children count: ${node.children?.length || 0}`);
      if (node.children) {
        node.children.forEach((child, index) => {
          console.log(`${'  '.repeat(depth + 2)}Child ${index}: ${child.type} - "${child.text || 'N/A'}"`);
          if (child.children) {
            child.children.forEach((grandchild, grandIndex) => {
              console.log(`${'  '.repeat(depth + 3)}Grandchild ${grandIndex}: ${grandchild.type} - "${grandchild.text || 'N/A'}"`);
            });
          }
        });
      }
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findSwitchStatements(child, depth + 1)) return true;
      }
    }
    
    return false;
  }
  
  findSwitchStatements(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}