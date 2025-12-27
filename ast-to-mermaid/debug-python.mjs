#!/usr/bin/env node

/**
 * Debug script for Python parsing
 */

import { readFileSync } from 'fs';
import { extractPython } from './src/mappings/languages/python/extractors/python-extractor.mjs';
import { normalizePython } from './src/mappings/languages/python/normalizer/normalize-python.mjs';

console.log('Debugging Python parsing...\n');

try {
  // Read the Python test file
  const pythonCode = readFileSync('./function-call-test.py', 'utf8');
  console.log('Python code loaded successfully');
  console.log('Code:', pythonCode);
  
  // Parse the Python code to AST
  console.log('\nParsing Python code to AST...');
  const ast = extractPython(pythonCode);
  console.log('AST type:', ast?.type);
  console.log('AST childCount:', ast?.childCount);
  console.log('AST children count:', ast?.children?.length);
  console.log('AST text preview:', ast?.text?.substring(0, 100) + '...');
  
  // Normalize the AST
  console.log('\nNormalizing AST...');
  const normalized = normalizePython(ast);
  console.log('Normalized result:', JSON.stringify(normalized, null, 2));
  
  console.log('\nDebug completed successfully!');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}