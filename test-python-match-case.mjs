import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test Python match-case functionality
const pythonCode = `
def handle_value(value):
    match value:
        case 1:
            print("value is 1")
        case 2:
            print("value is 2") 
        case 3:
            print("value is 3")
        case _:
            print("value is something else")

handle_value(2)
`;

console.log('Testing Python match-case functionality:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);