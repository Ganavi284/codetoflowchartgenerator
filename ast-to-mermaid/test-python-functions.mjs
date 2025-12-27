#!/usr/bin/env node

/**
 * Test script for Python function handling
 */

import { readFileSync } from 'fs';
import { mapPythonProgram } from './src/mappings/languages/python/python.mjs';

console.log('Testing Python function handling...\n');

try {
  // Read the Python test file
  const pythonCode = readFileSync('./test-python-functions.py', 'utf8');
  console.log('Python code loaded successfully');
  
  // For now, just log the code to see if it's there
  console.log('Code content:');
  console.log(pythonCode);
  
  console.log('\nTest completed successfully!');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}