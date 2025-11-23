import fs from 'fs';
import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

// Read the test C file
const sourceCode = fs.readFileSync('test-flowchart.c', 'utf8');

console.log('Debugging raw AST structure...');
console.log('=============================');

try {
  // 1. Extract AST
  const ast = extractC(sourceCode);
  console.log('Raw AST:');
  console.log(JSON.stringify(ast, null, 2));
  
  // Let's also look at specific parts of the AST
  console.log('\nFunction definition children:');
  if (ast.children && ast.children.length > 0) {
    const funcDef = ast.children.find(child => child.type === 'function_definition');
    if (funcDef) {
      console.log(`Function definition has ${funcDef.children.length} children:`);
      funcDef.children.forEach((child, index) => {
        console.log(`  ${index}: ${child.type} - ${child.text || 'N/A'}`);
      });
    }
  }
  
  // Look for for_statement
  console.log('\nFor statement analysis:');
  function findForStatement(node) {
    if (node.type === 'for_statement') {
      console.log(`For statement has ${node.children.length} children:`);
      node.children.forEach((child, index) => {
        console.log(`  ${index}: ${child.type} - ${child.text || 'N/A'}`);
      });
      return true;
    }
    
    if (node.children) {
      for (const child of node.children) {
        if (findForStatement(child)) return true;
      }
    }
    
    return false;
  }
  
  findForStatement(ast);
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}