import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging if statement normalization...');
console.log('====================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  
  // Look for if statements
  function findIfStatements(node, depth = 0) {
    if (node.type === 'If') {
      console.log(`${'  '.repeat(depth)}If statement:`);
      console.log(`${'  '.repeat(depth + 1)}Condition:`, node.cond);
      console.log(`${'  '.repeat(depth + 1)}Then:`, node.then);
      console.log(`${'  '.repeat(depth + 1)}Else:`, node.else);
      return true;
    }
    
    if (node.body && Array.isArray(node.body)) {
      for (const child of node.body) {
        if (findIfStatements(child, depth + 1)) return true;
      }
    } else if (node.body) {
      return findIfStatements(node.body, depth + 1);
    }
    
    return false;
  }
  
  findIfStatements(normalized);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}