import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test Python match-case with coordinates
const pythonCode = `
point = (0, 1)

match point:
    case (0, 0):
        print('Origin')
    case (0, y):
        print('On Y-axis')
    case (x, 0):
        print('On X-axis')
`;

console.log('Testing Python match-case flowchart generation:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);