import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `
score = 85

if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
else:
    grade = 'F'
    
print(grade)
`;

console.log('Testing Python if-elif-else flowchart generation...');
const result = generateFlowchart(pythonCode);
console.log(result);