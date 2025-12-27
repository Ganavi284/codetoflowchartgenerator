import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';
import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { mapNodePascal } from './ast-to-mermaid/src/mappings/languages/pascal/map-node-pascal.mjs';

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

console.log('Diagnosing Pascal flowchart generation issue...');
console.log('Test code:');
console.log(testCode);

try {
  // Step 1: Extract AST
  console.log('\n--- STEP 1: Extracting AST ---');
  const ast = extractPascal(testCode);
  console.log('AST:', JSON.stringify(ast, null, 2));
  
  // Step 2: Normalize AST
  console.log('\n--- STEP 2: Normalizing AST ---');
  const normalized = normalizePascal(ast);
  console.log('Normalized:', JSON.stringify(normalized, null, 2));
  
  // Step 3: Create context and walk
  console.log('\n--- STEP 3: Creating context and walking ---');
  const context = ctx();
  context.handle = function(node) {
    console.log('Handling node type:', node.type);
    if (node && node.type) {
      mapNodePascal(node, this);
    }
  };
  
  if (normalized) {
    if (normalized.type === 'Program' && normalized.body) {
      normalized.body.forEach(statement => {
        walk(statement, context);
      });
    }
  }
  delete context.handle;
  
  console.log('Context nodes:', context.nodes);
  console.log('Context edges:', context.edges);
  
  // Step 4: Resolve pending joins
  console.log('\n--- STEP 4: Resolving pending joins ---');
  context.resolvePendingJoins('END');
  console.log('After resolving joins:');
  console.log('Context nodes:', context.nodes);
  console.log('Context edges:', context.edges);
  
  // Step 5: Emit flowchart
  console.log('\n--- STEP 5: Emitting flowchart ---');
  const flowchart = context.emit();
  console.log('Generated flowchart:');
  console.log(flowchart);
  
} catch (error) {
  console.error('Error:', error);
}