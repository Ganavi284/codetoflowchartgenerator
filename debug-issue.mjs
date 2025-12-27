import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `a = 3

if a % 2 == 0:
    print("Even number")
else:
    print("Odd number")`;

console.log('Testing the exact case that shows duplicate nodes:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);

// Let's also try a simpler case
const simpleCode = `if True:
    print("Hello")
else:
    print("World")`;

console.log('\n\nTesting simple if-else:');
console.log(simpleCode);
console.log('\nGenerated flowchart:');
const simpleResult = generateFlowchart(simpleCode);
console.log(simpleResult);