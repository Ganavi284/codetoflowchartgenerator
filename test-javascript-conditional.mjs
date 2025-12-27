#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

// Test JavaScript code with the same grade checking conditional logic
const javascriptCode = `// JavaScript code to demonstrate conditional handling similar to the flowchart
let marks = 72;

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

console.log('Testing JavaScript conditional statements conversion to Mermaid...');
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