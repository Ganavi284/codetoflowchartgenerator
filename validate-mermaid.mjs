import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/python/pipeline/flow.mjs';

// Test simple match-case that might cause parsing issues
const pythonCode = `x = 1

match x:
    case 1:
        print("One")
    case _:
        print("Other")`;

console.log('Testing simple match-case for Mermaid parsing:');
console.log(pythonCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(pythonCode);
console.log(result);

// Check for potential problematic characters
console.log('\nValidating syntax...');
const hasPipes = result.includes('|');
const hasQuotes = result.includes('"');
const hasSpecialChars = /[<>{}`\\^]/.test(result);

console.log('Contains pipe characters (|):', hasPipes);
console.log('Contains quotes ("):', hasQuotes);
console.log('Contains other special chars:', hasSpecialChars);