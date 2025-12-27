import { generateFlowchart } from './src/mappings/languages/pascal/pipeline/flow.mjs';
import fs from 'fs';

console.log('Testing complex Pascal loops with conditionals inside loops and loops inside loops...\n');

// Test nested loops (loops inside loops)
const nestedLoopsCode = `program NestedLoops;
var
  i, j: integer;
begin
  for i := 1 to 3 do
  begin
    for j := 1 to 2 do
    begin
      writeln('i=', i, ' j=', j);
    end;
  end;
end.`;

console.log('Testing nested loops:');
console.log('Source code:');
console.log(nestedLoopsCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const nestedLoopsDiagram = generateFlowchart(nestedLoopsCode);
  console.log(nestedLoopsDiagram);
  fs.writeFileSync('nested-loops-output.mmd', nestedLoopsDiagram);
  console.log('\nNested loops diagram saved to: nested-loops-output.mmd\n');
} catch (error) {
  console.error('Error generating nested loops diagram:', error.message);
}

// Test conditionals inside loops
const conditionalsInLoopsCode = `program ConditionalsInLoops;
var
  i: integer;
begin
  for i := 1 to 5 do
  begin
    if i mod 2 = 0 then
      writeln(i, ' is even')
    else
      writeln(i, ' is odd');
  end;
end.`;

console.log('\nTesting conditionals inside loops:');
console.log('Source code:');
console.log(conditionalsInLoopsCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const conditionalsInLoopsDiagram = generateFlowchart(conditionalsInLoopsCode);
  console.log(conditionalsInLoopsDiagram);
  fs.writeFileSync('conditionals-in-loops-output.mmd', conditionalsInLoopsDiagram);
  console.log('\nConditionals in loops diagram saved to: conditionals-in-loops-output.mmd\n');
} catch (error) {
  console.error('Error generating conditionals in loops diagram:', error.message);
}

// Test complex scenario: nested loops with conditionals inside
const complexScenarioCode = `program ComplexScenario;
var
  i, j: integer;
begin
  for i := 1 to 3 do
  begin
    for j := 1 to 3 do
    begin
      if j > i then
        writeln('j > i: ', j, ' > ', i)
      else
        writeln('j <= i: ', j, ' <= ', i);
    end;
  end;
end.`;

console.log('\nTesting complex scenario (nested loops with conditionals):');
console.log('Source code:');
console.log(complexScenarioCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const complexScenarioDiagram = generateFlowchart(complexScenarioCode);
  console.log(complexScenarioDiagram);
  fs.writeFileSync('complex-scenario-output.mmd', complexScenarioDiagram);
  console.log('\nComplex scenario diagram saved to: complex-scenario-output.mmd\n');
} catch (error) {
  console.error('Error generating complex scenario diagram:', error.message);
}