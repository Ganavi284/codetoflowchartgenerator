import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Pascal code with a single statement
const singleStmtCode = `program SingleStmt;
begin
  writeln('Hello World');
end.`;

console.log('Testing single statement Pascal code:');
console.log(singleStmtCode);

try {
  const flowchart = generateFlowchart(singleStmtCode);
  console.log('\nGenerated flowchart:');
  console.log(flowchart);
} catch (error) {
  console.error('Error:', error);
}