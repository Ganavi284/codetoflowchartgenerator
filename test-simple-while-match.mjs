import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `while True:
    choice = 1
    match choice:
        case 1:
            print("One")
        case 2:
            print("Two")
        case _:
            break`;

console.log('Testing simple while with match-case:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);