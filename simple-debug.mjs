import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

const sourceCode = `
program CheckNumber;
begin
  if n >= 0 then
    writeln('Number is Positive')
  else
    writeln('Number is Negative');
end.
`;

console.log('Source code:');
console.log(sourceCode);

// Extract AST
console.log('\n--- Extracting AST ---');
const ast = extractPascal(sourceCode);
console.log('Extracted AST:');
console.log(JSON.stringify(ast, null, 2));

// Normalize AST
console.log('\n--- Normalizing AST ---');
const normalized = normalizePascal(ast);
console.log('Normalized AST:');
console.log(JSON.stringify(normalized, null, 2));