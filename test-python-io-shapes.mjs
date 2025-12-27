import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test Python I/O operations to verify shapes
const pythonCode = `
name = input("Enter your name: ")
print("Hello, " + name)

age = int(input("Enter your age: "))
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")
`;

console.log('Testing Python I/O operations with shapes:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);