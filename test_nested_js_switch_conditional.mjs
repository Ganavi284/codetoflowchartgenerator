#!/usr/bin/env node

// Test nested conditional inside JavaScript switch case
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

const code = `
let choice = 1;
let num = 7;

switch (choice) {
    case 1:
        if (num % 2 === 0) {
            console.log("Even number");
        } else {
            console.log("Odd number");
        }
        break;

    default:
        console.log("Invalid choice");
}
`;

console.log('Testing nested conditional inside JavaScript switch case:');
console.log('Generated flowchart:');
console.log(generateFlowchart(code));