import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';
import { walk } from './src/mappings/languages/c/walkers/walk.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Detailed debugging...');
console.log('====================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  
  // 3. Walk and collect all nodes with IDs
  console.log('\nWalking AST to collect nodes with IDs...');
  const nodes = [];
  let nodeId = 1;
  
  const walkerContext = {
    handle: (node) => {
      if (node && node.type) {
        const id = `N${nodeId++}`;
        nodes.push({
          id: id,
          type: node.type,
          text: node.text || node.name || node.value || 'N/A'
        });
        console.log(`${id}: ${node.type} - ${node.text || node.name || node.value || 'N/A'}`);
      }
    }
  };
  
  walk(normalized, walkerContext);
  
  console.log(`\nTotal nodes found: ${nodes.length}`);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}