import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';

const code = "switch (x) { case 1: console.log('One'); break; }";
console.log('Code:', code);

const ast = extractJavaScript(code);
console.log('Raw AST:');
console.log('Type:', ast.type);
console.log('Child count:', ast.children ? ast.children.length : 0);

if (ast.children) {
  ast.children.forEach((child, index) => {
    console.log(`Child ${index}: Type=${child.type}, Text="${child.text}"`);
  });
}