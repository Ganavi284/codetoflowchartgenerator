import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

const pythonCode = `while True:
    print("\\nMENU")
    print("1. Check Positive / Negative / Zero")
    print("2. Check Even or Odd")
    print("3. Exit")

    choice = int(input("Enter your choice: "))

    match choice:          # SWITCH (match-case)
        case 1:
            num = int(input("Enter a number: "))

            if num > 0:    # IF – ELIF – ELSE
                print("Positive number")
            elif num < 0:
                print("Negative number")
            else:
                print("Zero")

        case 2:
            num = int(input("Enter a number: "))

            if num % 2 == 0:
                print("Even number")
            else:
                print("Odd number")

        case 3:
            print("Exiting program...")
            break           # LOOP CONTROL

        case _:
            print("Invalid choice")`;

console.log('Testing menu example with while loop and match-case:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);