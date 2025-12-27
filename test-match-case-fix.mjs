import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test the specific match-case example from the user
const pythonCode = `
point = (0, 1)

match point:
    case (0, 0):
        print("Origin")
    case (0, y):
        print("On Y-axis")
    case (x, 0):
        print("On X-axis")
`;

console.log('Testing fixed Python match-case flowchart generation:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);

console.log('\nExpected behavior:');
console.log('- Should have sequential condition checks');
console.log('- First condition: match point == (0, 0)?');
console.log('- If Yes -> print("Origin")');
console.log('- If No -> next condition: match point == (0, y)?');
console.log('- And so on...');