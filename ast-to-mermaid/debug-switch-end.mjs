import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging switch end node handling...');
console.log('==================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  
  // Look for switch statements
  function findSwitchStatements(node, depth = 0) {
    if (node.type === 'Switch') {
      console.log(`${'  '.repeat(depth)}Found switch statement`);
      return true;
    }
    
    if (node.body && Array.isArray(node.body)) {
      for (const child of node.body) {
        if (findSwitchStatements(child, depth + 1)) return true;
      }
    } else if (node.body) {
      if (findSwitchStatements(node.body, depth + 1)) return true;
    }
    
    if (node.then) {
      if (findSwitchStatements(node.then, depth + 1)) return true;
    }
    
    if (node.else) {
      if (findSwitchStatements(node.else, depth + 1)) return true;
    }
    
    return false;
  }
  
  findSwitchStatements(normalized);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}