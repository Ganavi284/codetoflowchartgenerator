import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `
marks = 78

if marks >= 90:
    print('Grade A')
elif marks >= 75:
    print('Grade B')
elif marks >= 50:
    print('Grade C')
else:
    print('Fail')
`;

console.log('Testing Python conditional flowchart generation...');
const result = generateFlowchart(pythonCode);
console.log(result);