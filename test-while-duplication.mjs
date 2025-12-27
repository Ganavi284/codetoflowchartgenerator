#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Java code that matches the problematic flowchart
const javaCode = `class WhileLoop {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println(i);
            i++;
        }
    }
}`;

console.log('Testing while loop with duplication issue:');
console.log('========================================');
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