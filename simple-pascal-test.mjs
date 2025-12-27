import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Test with a simple Pascal program that has only one writeln statement
const testCode = `program HelloWorld;
begin
  writeln('Hello World');
end.`;

console.log('Testing simple Pascal program...');
console.log('Test code:');
console.log(testCode);

try {
  const flowchart = generateFlowchart(testCode);
  console.log('\nGenerated flowchart:');
  console.log(flowchart);
  
  // Check if START node is present
  if (flowchart.includes('START(["start"])')) {
    console.log('\n✓ START node is present');
  } else {
    console.log('\n✗ START node is MISSING');
  }
  
  // Check if END node is present
  if (flowchart.includes('END(["end"])')) {
    console.log('✓ END node is present');
  } else {
    console.log('✗ END node is MISSING');
  }
  
  // Check if there's a connection from the statement to END
  const lines = flowchart.split('\n');
  let hasConnectionToEND = false;
  for (const line of lines) {
    if (line.includes('-->') && line.includes('END')) {
      console.log(`✓ Connection to END found: ${line.trim()}`);
      hasConnectionToEND = true;
      break;
    }
  }
  
  if (!hasConnectionToEND) {
    console.log('✗ Connection to END is MISSING');
  }
  
} catch (error) {
  console.error('Error generating flowchart:', error);
}