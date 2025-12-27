import { extractPascal } from './src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import { walk } from './src/mappings/languages/pascal/walkers/walk.mjs';
import { mapNodePascal } from './src/mappings/languages/pascal/map-node-pascal.mjs';
import fs from 'fs';

console.log('Testing enhanced Pascal handling...\n');

try {
  // Read the test file
  const sourceCode = fs.readFileSync('./test-enhanced-pascal.pas', 'utf8');
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
  console.log('\n--- Generating Flowchart ---');
  
  // Create context for flowchart generation
  const context = ctx();
  
  // Add handle function to context
  context.handle = (node) => {
    if (node && node.type) {
      mapNodePascal(node, context);
    }
  };
  
  // Manually set the start node
  context.add('N1', '(["start"])');
  context.setLast('N1');
  
  // Walk the AST and generate flowchart elements
  if (normalized && normalized.body) {
    normalized.body.forEach(statement => {
      walk(statement, context);
    });
  }
  
  // Add end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // Connect last node to end node
  if (context.last) {
    context.addEdge(context.last, endId);
  }
  
  // Emit the final diagram
  const mermaidDiagram = context.emit();
  console.log('Generated Mermaid diagram:');
  console.log(mermaidDiagram);
  
  // Save to output file
  const outputFile = './enhanced-pascal-output.mmd';
  fs.writeFileSync(outputFile, mermaidDiagram);
  console.log(`\nMermaid diagram saved to: ${outputFile}`);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}