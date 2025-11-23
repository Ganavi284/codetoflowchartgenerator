import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Testing AST extraction and normalization...');
console.log('==========================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  console.log('AST extracted successfully!');
  console.log('AST type:', ast.type);
  console.log('AST children count:', ast.children?.length || 0);
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  console.log('\nNormalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}