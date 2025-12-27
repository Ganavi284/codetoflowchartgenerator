import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `a = 3

if a % 2 == 0:
    print("Even number")
else:
    print("Odd number")`;

console.log('Testing even/odd Python code:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);