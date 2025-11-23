import { extractC } from './src/mappings/languages/c/extractors/c-extractor.mjs';

const code = `int main() {
    scanf("%d", &x);
}`;

const ast = extractC(code);

function printTree(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.type} "${node.text?.substring(0, 30) || ''}..."`);
  for (let i = 0; i < node.childCount; i++) {
    printTree(node.child(i), depth + 1);
  }
}

printTree(ast);
