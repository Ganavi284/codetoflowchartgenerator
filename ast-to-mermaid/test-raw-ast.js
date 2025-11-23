import { extractCpp } from './src/mappings/languages/cpp/extractors/cpp-extractor.mjs';
import fs from 'fs';

// Read the C++ test file
const sourceCode = fs.readFileSync('./cpp-if-else-test.cpp', 'utf8');

console.log('C++ Source Code:');
console.log(sourceCode);
console.log('\n' + '='.repeat(50) + '\n');

// Extract AST using Tree-sitter
const ast = extractCpp(sourceCode);
console.log('Raw AST:');
console.log(JSON.stringify(ast, null, 2));