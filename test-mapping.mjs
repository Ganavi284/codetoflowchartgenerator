import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/javascript/mermaid/context.mjs';
import { mapSwitchStatement, mapCase, mapDefault } from './ast-to-mermaid/src/mappings/languages/javascript/conditional/switch/switch.mjs';

// Test JavaScript switch statement with break statements
const testCode = `
let grade = prompt("Enter grade:");

switch (grade) {
  case 'A':
    console.log("Excellent");
    break;
  case 'B':
    console.log("Good");
    break;
  case 'C':
    console.log("Average");
    break;
  default:
    console.log("Fail");
}
`;

console.log('Testing switch mapping functions:');
const ast = extractJavaScript(testCode);
const normalized = normalizeJavaScript(ast);

// Find the switch statement in the normalized AST
let switchNode = null;
function findSwitch(node) {
  if (!node) return;
  if (node.type === 'Switch') {
    switchNode = node;
    return;
  }
  if (Array.isArray(node.body)) {
    node.body.forEach(findSwitch);
  } else if (node.body) {
    findSwitch(node.body);
  }
  if (node.cases) {
    node.cases.forEach(findSwitch);
  }
  if (node.consequent) {
    node.consequent.forEach(findSwitch);
  }
}

findSwitch(normalized);
console.log('Found switch node:', switchNode ? 'Yes' : 'No');

if (switchNode) {
  const context = ctx();
  console.log('Testing mapSwitchStatement...');
  mapSwitchStatement(switchNode, context, null);
  console.log('Context after mapSwitchStatement:', context);
  
  // Test mapping a case
  if (switchNode.cases && switchNode.cases.length > 0) {
    console.log('Testing mapCase...');
    mapCase(switchNode.cases[0], context);
    console.log('Context after mapCase:', context);
  }
}