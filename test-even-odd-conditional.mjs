#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/typescript/pipeline/flow.mjs';

// Test TypeScript code with the even/odd conditional logic
const typescriptCode = `// TypeScript code to demonstrate even/odd conditional handling
let num: number = 5;

if (num % 2 === 0) {
    console.log("Even number");
} else {
    console.log("Odd number");
}`;

console.log('Testing TypeScript even/odd conditional statements conversion to Mermaid...');
console.log('Input TypeScript code:');
console.log(typescriptCode);
console.log('\n' + '='.repeat(50));

try {
  const result = generateFlowchart(typescriptCode);
  console.log('Generated Mermaid Flowchart:');
  console.log(result);
} catch (error) {
  console.error('Error occurred while converting TypeScript code:', error.message);
  console.error(error.stack);
}