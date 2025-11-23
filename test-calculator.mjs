import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

// Test JavaScript calculator switch statement
const testCode = `
let a = Number(prompt("Enter first number:"));
let b = Number(prompt("Enter second number:"));
let op = prompt("Enter operator (+, -, *, /):");

switch (op) {
  case '+':
    console.log("Result = " + (a + b));
    break;
  case '-':
    console.log("Result = " + (a - b));
    break;
  case '*':
    console.log("Result = " + (a * b));
    break;
  case '/':
    console.log("Result = " + (a / b));
    break;
  default:
    console.log("Invalid operator");
}
`;

console.log('Testing JavaScript calculator switch statement:');
console.log('Input code:');
console.log(testCode);
console.log('\nGenerated flowchart:');
console.log(generateFlowchart(testCode));