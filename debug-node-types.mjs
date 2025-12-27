import { extractPascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

// Test with complex conditionals and switch statements
const testCode = `program TestConditionals;
var
  score: integer;
  grade: char;
begin
  write('Enter your score: ');
  readln(score);
  
  // Simple if statement
  if score >= 90 then
    writeln('Excellent!');
  
  // If-else statement
  if score >= 60 then
    writeln('Passed')
  else
    writeln('Failed');
  
  // If-else-if ladder
  if score >= 90 then
    grade := 'A'
  else if score >= 80 then
    grade := 'B'
  else if score >= 70 then
    grade := 'C'
  else if score >= 60 then
    grade := 'D'
  else
    grade := 'F';
  
  writeln('Your grade is: ', grade);
  
  // Case statement
  case grade of
    'A': writeln('Outstanding performance!');
    'B': writeln('Good job!');
    'C': writeln('Satisfactory');
    'D': writeln('Needs improvement');
    'F': writeln('Failed - please try again');
  else
    writeln('Invalid grade');
  end;
  
  // Nested if statement
  if score >= 60 then
  begin
    if score >= 90 then
      writeln('You got an A!')
    else
      writeln('You passed but can do better');
  end;
end.`;

console.log('=== Debug Node Types ===\n');

console.log('Test code:');
console.log(testCode);
console.log('\n' + '='.repeat(60));

try {
  // Extract AST
  const ast = extractPascal(testCode);
  console.log('\n1. Extracted AST:');
  console.log(JSON.stringify(ast, null, 2));
  
  // Normalize AST
  const normalized = normalizePascal(ast);
  console.log('\n2. Normalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
  
} catch (error) {
  console.error('Error:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('\n🎉 Debug completed!');