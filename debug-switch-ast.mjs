import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';

const code = "let x = 2; switch (x) { case 1: console.log('One'); break; case 2: console.log('Two'); break; default: console.log('Other'); }";
console.log('Code:', code);

const ast = extractJavaScript(code);
console.log('Raw AST:');
console.log(JSON.stringify(ast, null, 2));