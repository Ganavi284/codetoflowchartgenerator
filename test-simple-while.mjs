#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Simple Java code with while loop
const javaCode = `class SimpleWhile {
    public static void main(String[] args) {
        int i = 0;
        while (i < 3) {
            System.out.println(i);
            i++;
        }
    }
}`;

console.log('Testing simple Java while loop:');
console.log('==============================');
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