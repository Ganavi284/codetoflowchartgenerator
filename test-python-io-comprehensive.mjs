import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test comprehensive Python I/O operations
const pythonCode = `
# File operations
file = open("data.txt", "r")
content = file.read()
file.close()

# Input operations
name = input("Enter your name: ")
age = int(input("Enter your age: "))

# Print operations
print("Hello, " + name)
print("You are", age, "years old")

# Conditional with I/O
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# More complex I/O
numbers = []
for i in range(3):
    num = int(input(f"Enter number {i+1}: "))
    numbers.append(num)

print("You entered:", numbers)
`;

console.log('Testing comprehensive Python I/O operations:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);