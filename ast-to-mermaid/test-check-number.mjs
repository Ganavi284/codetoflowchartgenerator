import { generateFlowchart } from './src/mappings/languages/pascal/pipeline/flow.mjs';
import fs from 'fs';

console.log('Testing Pascal CheckNumber program...\n');

try {
  // Read the Pascal file
  const sourceCode = fs.readFileSync('../pascal-check-number.pas', 'utf8');
  console.log('Source code:');
  console.log(sourceCode);
  
  // Generate Mermaid flowchart
  console.log('\nGenerating Mermaid diagram...\n');
  const mermaidDiagram = generateFlowchart(sourceCode);
  
  // Display the result
  console.log('Generated Mermaid diagram:');
  console.log(mermaidDiagram);
  
  // Save to output file
  const outputFile = '../pascal-check-number-output.mmd';
  fs.writeFileSync(outputFile, mermaidDiagram);
  console.log(`\nMermaid diagram saved to: ${outputFile}`);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}