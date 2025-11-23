import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';
import { walk } from './src/mappings/languages/c/walkers/walk.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging node generation...');
console.log('==========================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  console.log('AST extracted successfully!');
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  console.log('\nNormalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
  
  // 3. Walk and collect all nodes
  console.log('\nWalking AST to collect nodes...');
  const nodes = [];
  
  const walkerContext = {
    handle: (node) => {
      if (node && node.type) {
        nodes.push({
          type: node.type,
          text: node.text || node.name || 'N/A'
        });
        console.log(`Node: ${node.type} - ${node.text || node.name || 'N/A'}`);
      }
    }
  };
  
  walk(normalized, walkerContext);
  
  console.log(`\nTotal nodes found: ${nodes.length}`);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}