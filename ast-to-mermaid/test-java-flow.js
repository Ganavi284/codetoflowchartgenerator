import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';
import { readFileSync } from 'fs';

// Test with simple Java code
const simpleJavaCode = `
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
    case 5:
        System.out.println("Friday");
        break;
    case 6:
        System.out.println("Saturday");
        break;
    case 7:
        System.out.println("Sunday");
        break;
    default:
        System.out.println("Invalid day");
        break;
}

System.out.println("After switch statement");
`;

console.log('Generating flowchart for simple Java code:');
console.log('==========================================');
const simpleFlowchart = generateFlowchart(simpleJavaCode);
console.log(simpleFlowchart);
console.log('\n');

// Test with complex Java code
const complexJavaCode = `
int number = 2;
int result = 0;

if (number > 0) {
    result = number * 2;
} else {
    result = number * -1;
}

switch (number) {
    case 1:
        System.out.println("One");
        // Fall through
    case 2:
        System.out.println("Two");
        // Fall through
    case 3:
        System.out.println("Three");
        result = result + 10;
        break;
    case 4:
        System.out.println("Four");
        break;
    default:
        System.out.println("Other number");
        result = -1;
        break;
}

for (int i = 0; i < 3; i++) {
    System.out.println("Loop iteration: " + i);
    result = result + i;
}

System.out.println("Final result: " + result);
`;

console.log('Generating flowchart for complex Java code:');
console.log('===========================================');
const complexFlowchart = generateFlowchart(complexJavaCode);
console.log(complexFlowchart);