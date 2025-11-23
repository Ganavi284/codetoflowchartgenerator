import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging default case statement structure...');
console.log('========================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for switch statements and examine their case statements
  function findSwitchCaseStatements(node, depth = 0) {
    if (node.type === 'switch_statement') {
      console.log(`${'  '.repeat(depth)}switch_statement children:`);
      if (node.children && node.children[2] && node.children[2].children) {
        node.children[2].children.forEach((child, index) => {
          if (child.type === 'case_statement') {
            console.log(`${'  '.repeat(depth + 1)}Case ${index}:`);
            console.log(`${'  '.repeat(depth + 2)}Text: ${child.text}`);
            console.log(`${'  '.repeat(depth + 2)}Children count: ${child.children?.length || 0}`);
            if (child.children) {
              child.children.forEach((grandchild, grandIndex) => {
                console.log(`${'  '.repeat(depth + 3)}Child ${grandIndex}: ${grandchild.type} - "${grandchild.text || 'N/A'}"`);
              });
            }
          }
        });
      }
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findSwitchCaseStatements(child, depth + 1)) return true;
      }
    }
    
    return false;
  }
  
  findSwitchCaseStatements(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}