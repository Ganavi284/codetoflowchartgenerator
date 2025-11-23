import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

const sourceCode = `
int main() {
    int i = 0;
    if (i > 2) {
        printf("i is greater than 2: %d\\n", i);
    } else {
        printf("i is less than or equal to 2: %d\\n", i);
    }
    return 0;
}
`;

// Extract AST
const ast = extractC(sourceCode);

// Find the if statement and print its structure
function findIfStatement(node) {
  if (!node) return;
  
  if (node.type === 'if_statement') {
    console.log('If statement AST structure:');
    console.log('Type:', node.type);
    console.log('Children count:', node.children.length);
    console.log('Children:');
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      console.log(`  ${i}: Type=${child.type}, Text="${child.text}"`);
    }
    return;
  }
  
  if (node.children) {
    for (const child of node.children) {
      findIfStatement(child);
    }
  }
}

findIfStatement(ast);