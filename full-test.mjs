import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { mapNodePascal } from './ast-to-mermaid/src/mappings/languages/pascal/map-node-pascal.mjs';
import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';

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

// Generate flowchart
console.log('\n--- Generating flowchart ---');

// Create context for flowchart generation
const context = ctx();

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

// Create a walker context that uses the mapping functions
const walkerContext = {
  handle: (node) => {
    if (node && node.type) {
      console.log('Handling node:', node.type);
      // Use the mapping function to add nodes to the context
      mapNodePascal(node, context);
    }
  }
};

// Walk each node in the main program's body
if (normalized && normalized.body) {
  normalized.body.forEach(node => {
    console.log('Walking node:', node.type);
    walk(node, walkerContext);
  });
}

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve any pending joins (if statements, case statements, etc.)
if (typeof context.resolvePendingJoins === 'function') {
  context.resolvePendingJoins(endId);
}

// Connect last node to end node (only if there's a last node and it's not null)
if (context.last) {
  context.addEdge(context.last, endId);
}

console.log('\nContext nodes:', context.nodes);
console.log('Context edges:', context.edges);

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);