import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Comprehensive test of Python I/O operations with proper shapes
const pythonCode = `
# Standard input/output
name = input("Enter your name: ")
print("Hello, " + name)

# File operations
file = open("data.txt", "w")
file.write("Hello, world!")
file.close()

# System I/O
import sys
sys.stdout.write("Direct output\\n")

# Complex I/O with conditions and loops
numbers = []
count = int(input("How many numbers? "))

for i in range(count):
    num = int(input(f"Enter number {i+1}: "))
    numbers.append(num)  # This should NOT be treated as I/O operation

# Print results
print(f"Numbers entered: {numbers}")

# Conditional I/O
if len(numbers) > 0:
    avg = sum(numbers) / len(numbers)
    print(f"Average: {avg}")
else:
    print("No numbers entered")

# More file operations
with open("results.txt", "w") as f:
    f.write(f"Results: {numbers}")
`;

console.log('Testing comprehensive Python I/O operations with proper shapes:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);

console.log('\n--- Key improvements ---');
console.log('1. Input operations (input()) use parallelogram shape: [/"..."/]');
console.log('2. Print operations (print()) use parallelogram shape: [/"..."/]');
console.log('3. File operations (open, write, close) use parallelogram shape: [/"..."/]');
console.log('4. System I/O (sys.stdout.write) use parallelogram shape: [/"..."/]');
console.log('5. Non-I/O operations (like .append()) use regular rectangle: [...]');
console.log('6. Conditions and loops use appropriate shapes: rhombus for decisions, rectangle for processes');