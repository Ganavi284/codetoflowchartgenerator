import { extractCpp } from './src/mappings/languages/cpp/extractors/cpp-extractor.mjs';
import fs from 'fs';

// Read the C++ test file
const sourceCode = fs.readFileSync('./cpp-if-else-test.cpp', 'utf8');

console.log('C++ Source Code:');
console.log(sourceCode);
console.log('\n' + '='.repeat(50) + '\n');

// Extract AST using Tree-sitter
const ast = extractCpp(sourceCode);

// Function to extract only relevant parts of the AST
function extractRelevantAST(node, depth = 0) {
  if (!node) return null;
  
  const indent = '  '.repeat(depth);
  
  // Only show the main structure
  if (depth > 10) return `${indent}...`;
  
  const result = {
    type: node.type,
    text: node.text ? node.text.substring(0, 100) + (node.text.length > 100 ? '...' : '') : undefined
  };
  
  if (node.children && node.children.length > 0 && depth < 5) {
    result.children = node.children.map(child => extractRelevantAST(child, depth + 1)).filter(Boolean);
  }
  
  return result;
}

console.log('Relevant AST Structure:');
console.log(JSON.stringify(extractRelevantAST(ast), null, 2));