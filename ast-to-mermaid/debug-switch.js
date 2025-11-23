import { extractCpp } from './src/mappings/languages/cpp/extractors/cpp-extractor.mjs';
import fs from 'fs';

// Read the C++ test file
const sourceCode = fs.readFileSync('./test-switch.cpp', 'utf8');

console.log('C++ Source Code:');
console.log(sourceCode);
console.log('\n' + '='.repeat(50) + '\n');

// Extract AST using Tree-sitter
const ast = extractCpp(sourceCode);

console.log('AST Structure for switch statement:');
function printNode(node, depth = 0) {
  if (!node) return;
  const indent = '  '.repeat(depth);
  
  // Print switch-related nodes
  if (node.type.includes('switch') || node.type.includes('case') || node.type === 'default') {
    console.log(`${indent}*** SWITCH NODE *** ${node.type}: ${node.text ? `"${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"` : '""'}`);
    // Print children for case and default nodes
    if (node.type === 'case_statement' || node.type === 'default') {
      console.log(`${indent}  Children:`);
      if (node.children) {
        node.children.forEach((child, index) => {
          if (child) {
            console.log(`${indent}    ${index}: ${child.type} -> ${child.text ? `"${child.text.substring(0, 30)}${child.text.length > 30 ? '...' : ''}"` : '""'}`);
          }
        });
      }
    }
  } else {
    console.log(`${indent}${node.type}: ${node.text ? `"${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"` : '""'}`);
  }
  
  // Continue searching in children
  if (node.children && depth < 10) {
    node.children.forEach((child, index) => {
      if (child) {
        printNode(child, depth + 1);
      }
    });
  }
}

printNode(ast);