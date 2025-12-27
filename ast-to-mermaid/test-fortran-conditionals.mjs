import { generateFlowchart } from './src/mappings/languages/fortran/pipeline/flow.mjs';
import fs from 'fs';

console.log('Testing Fortran conditional statements...\n');

try {
  // Read the test file
  const sourceCode = fs.readFileSync('./test-fortran-conditionals.f90', 'utf8');
  console.log('Source code:');
  console.log(sourceCode);
  console.log('\n' + '='.repeat(60));
  console.log('Generated Mermaid Diagram:');
  
  // Generate Mermaid flowchart
  const mermaidDiagram = generateFlowchart(sourceCode);
  console.log(mermaidDiagram);
  
  // Save to file
  const outputFile = 'test-fortran-conditionals-output.mmd';
  fs.writeFileSync(outputFile, mermaidDiagram);
  console.log(`\nOutput saved to: ${outputFile}`);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}