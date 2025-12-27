#!/usr/bin/env node

// Create a simple test to see if the switch statement works correctly in JavaScript
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs';

const code = `
let day = 3;
switch (day) {
    case 1:
        console.log("Monday");
        break;
    case 2:
        console.log("Tuesday");
        break;
    case 3:
        console.log("Wednesday");
        break;
    default:
        console.log("Invalid day");
}
`;

console.log('Testing JavaScript switch statement handling:');
console.log('Generated flowchart:');
console.log(generateFlowchart(code));