import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

// Test JavaScript switch statement with fall-through behavior
const testCode = `
let grade = prompt("Enter grade:");

switch (grade) {
  case 'A':
    console.log("Excellent");
    // No break - fall through
  case 'B':
    console.log("Good or Excellent");
    break;
  case 'C':
    console.log("Average");
    break;
  default:
    console.log("Fail");
}
`;

console.log('Testing JavaScript switch statement with fall-through:');
console.log('Input code:');
console.log(testCode);
console.log('\nGenerated flowchart:');
console.log(generateFlowchart(testCode));