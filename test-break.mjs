import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

// Simple test with break statement
const testCode = `
switch (x) {
  case 1:
    console.log("One");
    break;
}
`;

console.log('Testing break statement processing:');
const ast = extractJavaScript(testCode);
const normalized = normalizeJavaScript(ast);
console.log(JSON.stringify(normalized, null, 2));