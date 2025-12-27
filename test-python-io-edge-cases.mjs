import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test Python I/O edge cases
const pythonCode = `
# Standard I/O operations
name = input("Enter your name: ")
print("Hello, " + name)

# File operations
file = open("data.txt", "w")
file.write("Hello, world!")
file.close()

# System I/O
import sys
sys.stdout.write("Direct output\\n")

# More complex I/O
numbers = []
for i in range(2):
    num = int(input(f"Enter number {i+1}: "))
    numbers.append(num)

# Print results
print(f"Numbers: {numbers}")

# Conditional I/O
if len(numbers) > 0:
    print("You entered some numbers")
    for num in numbers:
        print(f"Number: {num}")
else:
    print("No numbers entered")
`;

console.log('Testing Python I/O edge cases:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);