import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test the exact case from the user's issue
const pythonCode = `a = 3

if a % 2 == 0:
    print("Even number")
else:
    print("Odd number")`;

console.log('Testing user issue case:');
const result = generateFlowchart(pythonCode);
console.log(result);

// Let me also try to create a scenario that might cause duplicate nodes
// by having complex nested conditions
const complexCode = `
x = 10
y = 20

if x > 5:
    if y < 15:
        print("x > 5 and y < 15")
    else:
        print("x > 5 and y >= 15")
else:
    print("x <= 5")
`;

console.log('\n\nTesting complex nested case:');
const complexResult = generateFlowchart(complexCode);
console.log(complexResult);