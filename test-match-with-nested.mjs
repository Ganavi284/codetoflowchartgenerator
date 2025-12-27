import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test Python match-case with nested constructs
const pythonCode = `
value = 2

match value:
    case 1:
        x = 10
        if x > 5:
            print("x is greater than 5")
        else:
            print("x is 5 or less")
    case 2:
        for i in range(3):
            print(f"Loop iteration {i}")
    case _:
        while False:
            print("This won't execute")
`;

console.log('Testing Python match-case with nested constructs:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);