#!/usr/bin/env node

/**
 * Test script for Pascal conditional statements
 * This script tests if, if-else, if-elseif, and case statements
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Test files
const testFiles = [
  'test-if.pas',
  'else-if-chain.pas',
  'test-case.pas',
  'test-pascal-loops.pas',
  'test-all-pascal-loops.pas'
];

console.log('Testing Pascal conditional statements...\n');

try {
  // Run tests for each file
  testFiles.forEach(file => {
    const filePath = path.join('.', file);
    
    if (fs.existsSync(filePath)) {
      console.log(`Testing ${file}...`);
      
      try {
        // Run the CLI command
        const output = execSync(`node bin/cli.mjs -l pascal ${filePath}`, {
          cwd: process.cwd(),
          encoding: 'utf-8'
        });
        
        console.log(`✓ ${file} processed successfully`);
        console.log('Generated Mermaid diagram:');
        console.log(output);
        console.log('----------------------------------------\n');
      } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
      }
    } else {
      console.warn(`⚠ File ${file} not found, skipping...`);
    }
  });
  
  console.log('All tests completed.');
} catch (error) {
  console.error('Test suite failed:', error.message);
}