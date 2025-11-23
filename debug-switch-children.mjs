import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';

const code = "switch (x) { case 1: console.log('One'); break; }";
console.log('Code:', code);

const ast = extractJavaScript(code);
const switchStmt = ast.children[0];
console.log('Switch statement:');
console.log('Type:', switchStmt.type);
console.log('Text:', switchStmt.text);
console.log('Child count:', switchStmt.children ? switchStmt.children.length : 0);

if (switchStmt.children) {
  switchStmt.children.forEach((child, index) => {
    console.log(`Child ${index}: Type=${child.type}, Text="${child.text}"`);
    if (child.children) {
      console.log(`  Grandchild count: ${child.children.length}`);
      child.children.forEach((grandchild, gIndex) => {
        console.log(`    Grandchild ${gIndex}: Type=${grandchild.type}, Text="${grandchild.text}"`);
      });
    }
  });
}