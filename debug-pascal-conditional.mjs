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

console.log('Testing Pascal conditional handling...');
console.log('Test code:');
console.log(testCode);

try {
  const flowchart = generateFlowchart(testCode);
  console.log('\nGenerated flowchart:');
  console.log(flowchart);
  
  // Analyze the flowchart structure
  const lines = flowchart.split('\n');
  console.log('\nFlowchart analysis:');
  
  // Check for variable declaration
  const hasVarDecl = lines.some(line => line.includes('var n: integer'));
  console.log(`Variable declaration present: ${hasVarDecl}`);
  
  // Check for condition node
  const conditionNodes = lines.filter(line => line.includes('if n >= 0'));
  console.log(`Condition nodes: ${conditionNodes.length}`);
  conditionNodes.forEach((node, i) => console.log(`  ${i+1}. ${node}`));
  
  // Check for statement nodes
  const statementNodes = lines.filter(line => 
    line.includes('write(') || 
    line.includes('readln(') || 
    line.includes('writeln(')
  );
  console.log(`Statement nodes: ${statementNodes.length}`);
  statementNodes.forEach((node, i) => console.log(`  ${i+1}. ${node}`));
  
  // Check for edges
  const edges = lines.filter(line => line.includes('-->'));
  console.log(`Edges: ${edges.length}`);
  edges.forEach((edge, i) => console.log(`  ${i+1}. ${edge}`));
  
} catch (error) {
  console.error('Error generating flowchart:', error);
}