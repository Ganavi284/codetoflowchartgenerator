#!/usr/bin/env node

/**
 * Debug script to inspect Pascal AST structure
 */

import Parser from 'tree-sitter';
import Pascal from 'tree-sitter-pascal';
import fs from 'fs';

// Read the test file
const sourceCode = fs.readFileSync('test-pascal-loops.pas', 'utf8');

// Initialize parser
const parser = new Parser();
parser.setLanguage(Pascal);

// Parse the source code
const tree = parser.parse(sourceCode);

// Print the AST structure
console.log('Pascal AST for test-if.pas:');
console.log(tree.rootNode.toString());

// Print detailed node information
function printNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.type}: "${node.text}"`);
  
  for (let i = 0; i < node.childCount; i++) {
    printNode(node.child(i), depth + 1);
  }
}

console.log('\nDetailed AST structure:');
printNode(tree.rootNode);