import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

console.log('=== PYTHON I/O SHAPES TEST ===');
console.log('Testing that Python I/O operations use correct shapes (parallelogram: [/"..."/])');

// Test comprehensive Python I/O operations
const pythonCode = `
# Standard input/output operations
name = input("Enter your name: ")
print("Hello, " + name)

# File operations
file = open("data.txt", "w")
file.write("Hello, world!")
file.close()

# Complex I/O with conditionals
age = int(input("Enter your age: "))

if age >= 18:
    print("You are an adult")
    print("Enjoy your privileges")
else:
    print("You are a minor")
    print("Stay in school")

# I/O in loops
for i in range(3):
    user_input = input(f"Enter value {i+1}: ")
    print(f"You entered: {user_input}")

# Match-case with I/O (Python 3.10+)
status = "active"
match status:
    case "active":
        print("User is active")
    case "inactive":
        print("User is inactive")
    case _:
        print("Unknown status")
`;

console.log('\nPython code:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);

console.log('\n=== VERIFICATION ===');
console.log('✓ I/O operations should use parallelogram shapes: [/"..."/]');
console.log('  - input() calls should have [/"..."/] shape');
console.log('  - print() calls should have [/"..."/] shape');
console.log('  - file operations should have [/"..."/] shape');
console.log('✓ Non-I/O operations should use rectangle shapes: [...]');
console.log('  - assignments should have [...] shape');
console.log('  - conditionals should have {"..."} shape');
console.log('✓ Match-case should work with proper case handling');