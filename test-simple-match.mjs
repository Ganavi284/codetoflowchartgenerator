import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test simple Python match-case functionality (without function definition)
const pythonCode = `
value = 2

match value:
    case 1:
        print("value is 1")
    case 2:
        print("value is 2") 
    case 3:
        print("value is 3")
    case _:
        print("value is something else")
`;

console.log('Testing simple Python match-case functionality:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);