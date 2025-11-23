import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';
import { normalizeC } from './src/mappings/languages/c/normalizer/normalize-c.mjs';
import { walk } from './src/mappings/languages/c/walkers/walk.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('simple-test.c', 'utf8');

console.log('Testing AST extraction and normalization...');
console.log('==========================================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  console.log('AST extracted successfully!');
  
  // 2. Normalize AST
  const normalized = normalizeC(ast);
  console.log('\nNormalized AST:');
  console.log(JSON.stringify(normalized, null, 2));
  
  // 3. Walk and find main function
  console.log('\nWalking AST to find main function...');
  let mainFunctionBody = null;
  
  const findMainContext = {
    handle: (node) => {
      console.log(`Node type: ${node.type}, name: ${node.name || 'N/A'}`);
      if (node && node.type === 'Function' && node.name === 'main') {
        console.log('Found main function!');
        mainFunctionBody = node.body;
        console.log('Main function body:', JSON.stringify(mainFunctionBody, null, 2));
      }
    }
  };
  
  walk(normalized, findMainContext);
  
  if (mainFunctionBody) {
    console.log('\nWalking main function body...');
    const bodyNodes = [];
    const bodyContext = {
      handle: (node) => {
        if (node && node.type) {
          bodyNodes.push(node);
          console.log(`Body node: ${node.type}`);
        }
      }
    };
    
    walk(mainFunctionBody, bodyContext);
    console.log(`Found ${bodyNodes.length} nodes in main function body`);
  }
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}