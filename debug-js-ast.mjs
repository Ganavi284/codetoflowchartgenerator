import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

// Test JavaScript code with if statement
const code = `
let x = prompt("Enter a number:");
x = Number(x);
if (x > 0) {
  console.log("Positive");
}
`;

try {
  console.log('Source code:');
  console.log(code);
  
  // Extract AST
  console.log('\nExtracting AST...');
  const ast = extractJavaScript(code);
  console.log('AST extracted successfully');
  
  // Find the if_statement node and examine its children
  function findIfStatement(node) {
    if (!node) return null;
    if (node.type === 'if_statement') {
      return node;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = findIfStatement(child);
        if (result) return result;
      }
    }
    return null;
  }
  
  const ifNode = findIfStatement(ast);
  if (ifNode) {
    console.log('\nFound if_statement node:');
    console.log('Type:', ifNode.type);
    console.log('Text:', ifNode.text);
    console.log('Children count:', ifNode.children?.length || 0);
    
    if (ifNode.children) {
      console.log('\nChildren details:');
      for (let i = 0; i < ifNode.children.length; i++) {
        const child = ifNode.children[i];
        console.log(`  Child ${i}: type="${child.type}", text="${child.text}"`);
      }
    }
  } else {
    console.log('No if_statement node found');
  }
  
  // Normalize AST
  console.log('\nNormalizing AST...');
  const normalized = normalizeJavaScript(ast);
  console.log('AST normalized:');
  console.log(JSON.stringify(normalized, null, 2));
  
} catch (error) {
  console.error('Error:', error);
  console.error('Stack trace:', error.stack);
}