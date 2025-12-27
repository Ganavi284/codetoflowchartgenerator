#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Java code that matches the problematic flowchart
const javaCode = `class ComplexLoop {
    public static void main(String[] args) {
        for (int i = -2; i <= 2; i++) {
            if (i > 0) {
                System.out.println("Positive: " + i);
            } else if (i < 0) {
                System.out.println("Negative: " + i);
            } else {
                System.out.println("Zero: " + i);
            }
        }
    }
}`;

console.log('Testing complex loop with if-else-if:');
console.log('=====================================');
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