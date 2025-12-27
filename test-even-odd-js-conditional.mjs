#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

// Test JavaScript code with the even/odd conditional logic
const javascriptCode = `// JavaScript code to demonstrate even/odd conditional handling
let num = 5;

if (num % 2 === 0) {
    console.log("Even number");
} else {
    console.log("Odd number");
}`;

console.log('Testing JavaScript even/odd conditional statements conversion to Mermaid...');
console.log('Input JavaScript code:');
console.log(javascriptCode);
console.log('\n' + '='.repeat(50));

try {
  const result = generateFlowchart(javascriptCode);
  console.log('Generated Mermaid Flowchart:');
  console.log(result);
} catch (error) {
  console.error('Error occurred while converting JavaScript code:', error.message);
  console.error(error.stack);
}