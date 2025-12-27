import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';

// Very simple Pascal code
const minimalCode = `program Test;
begin
  writeln('Hello');
end.`;

console.log('Testing minimal Pascal code:');
console.log(minimalCode);

try {
  // Extract AST
  const ast = extractPascal(minimalCode);
  console.log('\nExtracted AST:');
  console.log(JSON.stringify(ast, null, 2));
  
  // Normalize AST
  const normalized = normalizePascal(ast);
  console.log('\nNormalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
  
  // Test context emit directly
  const context = ctx();
  console.log('\nEmpty context emit:');
  console.log(context.emit());
  
} catch (error) {
  console.error('Error:', error);
}