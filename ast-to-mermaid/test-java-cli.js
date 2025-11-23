#!/usr/bin/env node

// Test Java flowchart generation via CLI
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

// Simple switch example
const simpleSwitchExample = `
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    case 4:
        System.out.println("Thursday");
        break;
    default:
        System.out.println("Weekend");
        break;
}

System.out.println("After switch statement");
`;

// Fall-through example
const fallthroughExample = `
int value = 2;

switch (value) {
    case 1:
        System.out.println("One");
        // Fall through
    case 2:
        System.out.println("Two");
        // Fall through
    case 3:
        System.out.println("Three");
        break;
    default:
        System.out.println("Other");
        break;
}

System.out.println("Done");
`;

// Complex example with if and loop
const complexExample = `
int number = 5;
int result = 0;

if (number > 0) {
    result = number * 2;
} else {
    result = number * -1;
}

switch (number) {
    case 1:
        System.out.println("One");
        break;
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("Between 2 and 5");
        result = result + 10;
        break;
    default:
        System.out.println("Other number");
        break;
}

for (int i = 0; i < 3; i++) {
    System.out.println("Iteration: " + i);
}

System.out.println("Final result: " + result);
`;

console.log("=== Java Switch Statement Flowchart Generation ===\n");

console.log("1. Simple Switch Example:");
console.log("========================");
try {
    const simpleFlowchart = generateFlowchart(simpleSwitchExample);
    console.log(simpleFlowchart);
} catch (error) {
    console.error("Error generating simple switch flowchart:", error.message);
}

console.log("\n2. Fall-through Example:");
console.log("=======================");
try {
    const fallthroughFlowchart = generateFlowchart(fallthroughExample);
    console.log(fallthroughFlowchart);
} catch (error) {
    console.error("Error generating fallthrough flowchart:", error.message);
}

console.log("\n3. Complex Example:");
console.log("===================");
try {
    const complexFlowchart = generateFlowchart(complexExample);
    console.log(complexFlowchart);
} catch (error) {
    console.error("Error generating complex flowchart:", error.message);
}

console.log("\n=== Test Complete ===");