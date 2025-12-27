import { generateFlowchart } from './src/mappings/languages/pascal/pipeline/flow.mjs';
import fs from 'fs';

console.log('Testing Pascal loops from user query...\n');

// Test the Repeat-Until loop from user's query
const repeatUntilCode = `program RepeatUntil;
var
  i: integer;
begin
  i := 1;
  repeat
    writeln(i);
    i := i + 1;
  until i > 5;
end.`;

console.log('Testing Repeat-Until loop:');
console.log('Source code:');
console.log(repeatUntilCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const repeatUntilDiagram = generateFlowchart(repeatUntilCode);
  console.log(repeatUntilDiagram);
  fs.writeFileSync('repeat-until-output.mmd', repeatUntilDiagram);
  console.log('\nRepeat-Until diagram saved to: repeat-until-output.mmd\n');
} catch (error) {
  console.error('Error generating Repeat-Until diagram:', error.message);
}

// Test the For loop from user's query  
const forLoopCode = `program ForLoopReverse;
var
  i: integer;
begin
  for i := 5 downto 1 do
    writeln(i);
end.`;

console.log('\nTesting For loop:');
console.log('Source code:');
console.log(forLoopCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const forLoopDiagram = generateFlowchart(forLoopCode);
  console.log(forLoopDiagram);
  fs.writeFileSync('for-loop-output.mmd', forLoopDiagram);
  console.log('\nFor loop diagram saved to: for-loop-output.mmd\n');
} catch (error) {
  console.error('Error generating For loop diagram:', error.message);
}

// Test the While loop from user's query
const whileLoopCode = `program WhileLoop;
var
  i: integer;
begin
  i := 1;
  while i <= 5 do
  begin
    writeln(i);
    i := i + 1;
  end;
end.`;

console.log('\nTesting While loop:');
console.log('Source code:');
console.log(whileLoopCode);
console.log('\nGenerated Mermaid diagram:');

try {
  const whileLoopDiagram = generateFlowchart(whileLoopCode);
  console.log(whileLoopDiagram);
  fs.writeFileSync('while-loop-output.mmd', whileLoopDiagram);
  console.log('\nWhile loop diagram saved to: while-loop-output.mmd\n');
} catch (error) {
  console.error('Error generating While loop diagram:', error.message);
}