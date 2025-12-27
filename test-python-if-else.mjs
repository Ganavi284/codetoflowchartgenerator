import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `
x = 10

if x > 5:
    print('x is greater than 5')
else:
    print('x is 5 or less')
`;

console.log('Testing Python if-else flowchart generation...');
const result = generateFlowchart(pythonCode);
console.log(result);