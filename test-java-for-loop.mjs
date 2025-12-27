#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Read the Java example with for loop
const javaCode = readFileSync('./SimpleForLoop.java', 'utf8');

console.log('Testing Java for loop:');
console.log('======================');
const result = generateFlowchart(javaCode);
console.log(result);

// Check for connections in the output
const lines = result.split('\n');
const connections = [];
for (const line of lines) {
  if (line.includes('-->') && !line.trim().startsWith('flowchart')) {
    connections.push(line.trim());
  }
}

console.log('\nAll connections found:');
connections.forEach(conn => console.log(conn));