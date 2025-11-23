import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging case statement normalization...');
console.log('======================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // Look for case statements and normalize them
  function findAndNormalizeCaseStatements(node, depth = 0) {
    if (node.type === 'case_statement') {
      console.log(`${'  '.repeat(depth)}Raw case_statement:`);
      console.log(`${'  '.repeat(depth + 1)}Text: ${node.text}`);
      console.log(`${'  '.repeat(depth + 1)}Children count: ${node.children?.length || 0}`);
      if (node.children) {
        node.children.forEach((child, index) => {
          console.log(`${'  '.repeat(depth + 2)}Child ${index}: ${child.type} - "${child.text || 'N/A'}"`);
        });
      }
      
      // Normalize this node
      const normalized = normalizeC(node);
      console.log(`${'  '.repeat(depth)}Normalized case:`);
      console.log(`${'  '.repeat(depth + 1)}Type: ${normalized.type}`);
      console.log(`${'  '.repeat(depth + 1)}Value: "${normalized.value}"`);
      console.log(`${'  '.repeat(depth + 1)}Body count: ${normalized.body?.length || 0}`);
      
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findAndNormalizeCaseStatements(child, depth + 1)) return true;
      }
    }
    
    return false;
  }
  
  findAndNormalizeCaseStatements(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}