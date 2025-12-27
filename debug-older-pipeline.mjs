import { extractPascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { walk } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/mermaid/context.mjs';

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

console.log('Debugging older pipeline...');
console.log('Test code:');
console.log(testCode);

try {
  // 1. Extract AST
  console.log('\n--- Extracting AST ---');
  const ast = extractPascal(testCode);
  console.log('Extracted AST:');
  console.log(JSON.stringify(ast, null, 2));
  
  // 2. Normalize AST
  console.log('\n--- Normalizing AST ---');
  const normalized = normalizePascal(ast);
  console.log('Normalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
  
  // 3. Create context
  console.log('\n--- Creating context ---');
  const context = ctx();
  console.log('Context created');
  
  // 4. Walk nodes
  console.log('\n--- Walking nodes ---');
  if (normalized) {
    if (normalized.type === 'Program' && normalized.body) {
      console.log(`Processing ${normalized.body.length} statements:`);
      normalized.body.forEach((statement, index) => {
        console.log(`Statement ${index + 1}:`, statement.type);
        console.log('Statement details:', JSON.stringify(statement, null, 2));
        walk(statement, context);
      });
    }
  }
  
  // 5. Emit flowchart
  console.log('\n--- Emitting flowchart ---');
  const flowchart = context.emit();
  console.log('Generated flowchart:');
  console.log(flowchart);
  
} catch (error) {
  console.error('Error in pipeline:', error);
  console.error('Stack trace:', error.stack);
}