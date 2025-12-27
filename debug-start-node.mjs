import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Test with the exact code from your example
const testCode = `program CheckNumber;
var
  n: integer;
begin
  write('Enter a number: ');
  readln(n);

  if n >= 0 then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
end.`;

console.log('Testing Pascal flowchart generation...');
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
  
  // Check if flowchart connects START to first node
  const lines = flowchart.split('\n');
  const startLine = lines.find(line => line.includes('START -->'));
  if (startLine) {
    console.log(`✓ START connection found: ${startLine.trim()}`);
  } else {
    console.log('✗ START connection is MISSING');
  }
  
} catch (error) {
  console.error('Error generating flowchart:', error);
}