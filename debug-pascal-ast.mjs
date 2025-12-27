import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

// Test Pascal code with variable declaration
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

console.log('Testing Pascal AST extraction and normalization...');
console.log('Test code:');
console.log(testCode);

try {
  // Extract AST
  console.log('\n--- Extracting AST ---');
  const ast = extractPascal(testCode);
  console.log('Extracted AST:');
  console.log(JSON.stringify(ast, null, 2));
  
  // Normalize AST
  console.log('\n--- Normalizing AST ---');
  const normalized = normalizePascal(ast);
  console.log('Normalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}