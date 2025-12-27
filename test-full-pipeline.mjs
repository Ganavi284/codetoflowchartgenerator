import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';
import { mapNodePascal } from './ast-to-mermaid/src/mappings/languages/pascal/map-node-pascal.mjs';

const testCode = `
program TestLoops;
var
  i: integer;
begin
  for i := 1 to 3 do
    writeln('For loop: ', i);
  writeln('Done');
end.
`;

console.log('Testing full Pascal pipeline with loops...');

try {
  // Extract and normalize
  const ast = extractPascal(testCode);
  const normalized = normalizePascal(ast);
  
  // Create context and set up the walker
  const context = ctx();
  
  // Add handle function to context
  context.handle = (node) => {
    if (node && node.type) {
      console.log(`Handling node: ${node.type}`);
      mapNodePascal(node, context);
    }
  };
  
  // Add start node
  context.add('START', '(["start"])');
  context.setLast('START');
  
  // Walk the normalized AST
  console.log('Walking AST...');
  walk(normalized, context);
  
  // Add end node and connect
  const endId = context.next();
  context.add(endId, '(["end"])');
  if (context.last && context.last !== endId) {
    context.addEdge(context.last, endId);
  }
  
  // Generate and output the diagram
  const diagram = context.emit();
  console.log('\nGenerated Mermaid diagram:');
  console.log(diagram);
  
  console.log('\nFull pipeline test completed successfully!');
} catch (error) {
  console.error('Error in pipeline:', error);
}