import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `
x = 10
y = 5

if x > 5:
    if y > 3:
        print('Both x > 5 and y > 3')
    else:
        print('x > 5 but y <= 3')
else:
    print('x <= 5')
`;

console.log('Testing Python nested if-else flowchart generation...');
const result = generateFlowchart(pythonCode);
console.log(result);