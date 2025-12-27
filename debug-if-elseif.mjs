import { extractPascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

// Test just the if-else-if ladder
const testCode = `program TestIfElseIf;
var
  score: integer;
begin
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
end.`;

console.log('=== Debug If-Else-If Ladder ===\n');

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