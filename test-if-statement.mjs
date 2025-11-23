import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

// Test JavaScript code with if statement
const code = `
let x = prompt("Enter a number:");
x = Number(x);
if (x > 0) {
  console.log("Positive");
}
`;

try {
  const result = generateFlowchart(code);
  console.log('Generated flowchart:');
  console.log(result);
} catch (error) {
  console.error('Error generating flowchart:', error);
  console.error('Stack trace:', error.stack);
}