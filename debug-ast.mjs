import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

// Test JavaScript code with if-else-if statement from user
const jsCode = `
let marks = Number(prompt('Enter marks:'));
if (marks >= 90) {
  console.log('Grade A');
} else if (marks >= 75) {
  console.log('Grade B');
} else if (marks >= 50) {
  console.log('Grade C');
} else {
  console.log('Fail');
}
`;

console.log('JavaScript code:');
console.log(jsCode);

// Normalize AST
const ast = extractJavaScript(jsCode);
const normalized = normalizeJavaScript(ast);
console.log('\nNormalized AST:');
console.log(JSON.stringify(normalized, null, 2));

// Let's specifically look at the if statement structure
if (normalized && normalized.body && normalized.body.length > 1) {
  const ifStatement = normalized.body[1]; // The if statement
  console.log('\nIf statement structure:');
  console.log(`Type: ${ifStatement.type}`);
  console.log(`Test: ${JSON.stringify(ifStatement.test)}`);
  console.log(`Consequent: ${JSON.stringify(ifStatement.consequent)}`);
  console.log(`Alternate: ${JSON.stringify(ifStatement.alternate)}`);
  
  if (ifStatement.alternate) {
    console.log(`\nAlternate type: ${ifStatement.alternate.type}`);
    if (ifStatement.alternate.alternate) {
      console.log(`Alternate's alternate type: ${ifStatement.alternate.alternate.type}`);
      if (ifStatement.alternate.alternate.alternate) {
        console.log(`Alternate's alternate's alternate type: ${ifStatement.alternate.alternate.alternate.type}`);
      }
    }
  }
}