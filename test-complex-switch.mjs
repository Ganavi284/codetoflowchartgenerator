import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test complex switch-case with multiple nested constructs
const pythonCode = `
day = "monday"

match day:
    case "saturday" | "sunday":
        print("Weekend")
        x = 10
        while x > 0:
            print(f"Countdown: {x}")
            x -= 1
    case "monday":
        print("Start of week")
        for i in range(3):
            if i == 1:
                print("Middle of loop")
            else:
                print(f"Day {i}")
    case "friday":
        print("Weekend is coming")
    case _:
        print("Regular day")
        if True:
            print("Always true")
`;

console.log('Testing complex Python switch-case functionality:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);