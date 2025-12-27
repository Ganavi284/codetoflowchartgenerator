#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Java code with while loop
const javaCode = `class WhileLoopTest {
    public static void main(String[] args) {
        int i = 0;
        while (i < 5) {
            System.out.println("Value: " + i);
            i++;
        }
        System.out.println("Loop finished");
    }
}`;

console.log('Testing Java while loop:');
console.log('=======================');
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