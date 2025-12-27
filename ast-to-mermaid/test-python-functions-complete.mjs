#!/usr/bin/env node

/**
 * Comprehensive test for Python function handling
 */

import { readFileSync } from 'fs';
import { PythonParser } from './src/extractors/python-extractor.mjs';
import { mapPythonNode } from './src/mappings/languages/python/python-common.mjs';
import { ctx } from './src/mappings/languages/python/mermaid/context.mjs';

console.log('Comprehensive Python function handling test...\n');

try {
  // Read the Python test file
  const pythonCode = readFileSync('./test-python-functions.py', 'utf8');
  console.log('Python code loaded successfully');
  
  // Parse the Python code to AST
  console.log('Parsing Python code to AST...');
  const parser = new PythonParser();
  const ast = parser.parse(pythonCode);
  console.log('AST parsed successfully');
  
  // Create a context for flowchart generation
  const context = ctx();
  
  console.log('\nProcessing AST nodes...');
  // Process each node in the AST
  for (const node of ast.body) {
    console.log(`Processing node type: ${node.type}`);
    
    if (node.type === 'FunctionDef') {
      console.log(`  Function definition found: ${node.name}`);
    } else if (node.type === 'Expr' && node.value && node.value.type === 'Call') {
      console.log(`  Function call found: ${node.value.func?.id || node.value.func?.attr || 'unknown'}`);
    }
    
    // Map the node
    const mappedNode = mapPythonNode(node);
    console.log(`  Mapped to type: ${mappedNode.type}`);
    
    if (mappedNode.type === 'Function') {
      console.log(`  Function name: ${mappedNode.name}`);
      console.log(`  Parameters: ${mappedNode.params ? mappedNode.params.length : 0}`);
    } else if (mappedNode.type === 'FunctionCall') {
      console.log(`  Function call name: ${mappedNode.name}`);
      console.log(`  Arguments: ${mappedNode.arguments ? mappedNode.arguments.length : 0}`);
    }
  }
  
  console.log('\nTest completed successfully!');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}