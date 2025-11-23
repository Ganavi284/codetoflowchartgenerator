import fs from 'fs';
import { generateFlowchart } from './src/mappings/languages/c/pipeline/flow.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Testing flowchart generation...');
console.log('==============================');

try {
  const flowchart = generateFlowchart(sourceCode);
  console.log('Flowchart generated successfully!');
  console.log(flowchart);
} catch (error) {
  console.error('Error generating flowchart:', error.message);
  console.error('Stack:', error.stack);
}