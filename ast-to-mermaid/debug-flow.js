import { extractCpp } from './src/mappings/languages/cpp/extractors/cpp-extractor.mjs';
import { normalizeCpp } from './src/mappings/languages/cpp/normalizer/normalize-cpp.mjs';
import fs from 'fs';

// Read the C++ test file
const sourceCode = fs.readFileSync('./test-issues.cpp', 'utf8');

console.log('C++ Source Code:');
console.log(sourceCode);
console.log('\n' + '='.repeat(50) + '\n');

// 1. Extract AST using Tree-sitter
const ast = extractCpp(sourceCode);

// 2. Normalize AST to unified node types
const normalized = normalizeCpp(ast);

console.log('Normalized AST:');
console.log(JSON.stringify(normalized, null, 2));

console.log('\n' + '='.repeat(50) + '\n');

// Debug what mainProgramBody contains
console.log('Finding main program body:');
if (normalized) {
  console.log('Normalized type:', normalized.type);
  console.log('Normalized keys:', Object.keys(normalized));
  
  if (normalized.type === 'Program') {
    console.log('Found Program node');
    console.log('Body length:', normalized.body ? normalized.body.length : 'undefined');
    if (normalized.body) {
      normalized.body.forEach((node, index) => {
        console.log(`  Node ${index}: type=${node.type}, text=${node.text ? node.text.substring(0, 30) : 'undefined'}`);
        if (node.type === 'Function') {
          console.log(`    Function node keys:`, Object.keys(node));
          if (node.body) {
            console.log(`    Function body length:`, node.body.length);
            node.body.forEach((child, childIndex) => {
              console.log(`      Child ${childIndex}: type=${child.type}, text=${child.text ? child.text.substring(0, 30) : 'undefined'}`);
              if (child.type === 'Block') {
                console.log(`        Block body length:`, child.body ? child.body.length : 'undefined');
                if (child.body) {
                  child.body.forEach((grandChild, grandChildIndex) => {
                    console.log(`          Grandchild ${grandChildIndex}: type=${grandChild.type}, text=${grandChild.text ? grandChild.text.substring(0, 30) : 'undefined'}`);
                  });
                }
              }
            });
          }
        }
      });
    }
  }
}