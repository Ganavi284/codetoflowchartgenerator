import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Read the existing test file content
const pythonCode = `# Test Python match (switch) statement
x = 2

match x:
    case 1:
        print("One")
    case 2:
        print("Two")
    case 3:
        print("Three")
    case _:
        print("Other number")

# Another match example with different patterns
y = "hello"

match y:
    case "hello":
        print("Greetings")
    case "goodbye":
        print("Farewell")
    case _:
        print("Unknown word")`;

console.log('Testing real Python match-case functionality:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);