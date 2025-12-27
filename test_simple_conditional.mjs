#!/usr/bin/env node

// Test simple conditional outside switch
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/typescript/pipeline/flow.mjs';

const code = `
let num: number = 7;

if (num % 2 === 0) {
    console.log("Even number");
} else {
    console.log("Odd number");
}
console.log("After conditional");
`;

console.log('Testing simple conditional outside switch:');
console.log('Generated flowchart:');
console.log(generateFlowchart(code));