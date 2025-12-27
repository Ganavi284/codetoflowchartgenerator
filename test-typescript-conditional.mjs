#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/typescript/pipeline/flow.mjs';

// Test TypeScript code with the grade checking conditional logic
const typescriptCode = `// TypeScript code to demonstrate conditional handling similar to the flowchart
let marks: number = 72;

if (marks >= 90) {
    console.log("Grade A");
} else if (marks >= 75) {
    console.log("Grade B");
} else if (marks >= 50) {
    console.log("Grade C");
} else {
    console.log("Fail");
}

console.log("End of grade checking");`;

console.log('Testing TypeScript conditional statements conversion to Mermaid...');
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