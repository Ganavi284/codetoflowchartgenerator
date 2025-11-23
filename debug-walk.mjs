import { extractJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs';
import { normalizeJavaScript } from './ast-to-mermaid/src/mappings/languages/javascript/normalizer/normalize-javascript.mjs';

// Simple walker that logs what it's doing
function debugWalk(node, depth = 0) {
  const indent = '  '.repeat(depth);
  
  if (!node) {
    console.log(`${indent}null node`);
    return;
  }
  
  if (typeof node !== 'object') {
    console.log(`${indent}Non-object node: ${node}`);
    return;
  }
  
  console.log(`${indent}Node type: ${node.type || 'unknown'}`);
  
  // Special handling for Switch nodes
  if (node.type === 'Switch') {
    console.log(`${indent}Processing switch with ${node.cases ? node.cases.length : 0} cases`);
    if (node.cases) {
      node.cases.forEach((caseNode, index) => {
        console.log(`${indent}  Case ${index}:`);
        debugWalk(caseNode, depth + 2);
      });
    }
  } else if (node.type === 'Case' || node.type === 'Default') {
    console.log(`${indent}Processing ${node.type} with ${node.consequent ? node.consequent.length : 0} consequent statements`);
    if (node.consequent) {
      node.consequent.forEach((stmt, index) => {
        console.log(`${indent}    Consequent ${index}:`);
        debugWalk(stmt, depth + 3);
      });
    }
  } else {
    // General processing
    if (node.body) {
      console.log(`${indent}Processing body with ${Array.isArray(node.body) ? node.body.length : 1} items`);
      if (Array.isArray(node.body)) {
        node.body.forEach((child, index) => {
          console.log(`${indent}  Body item ${index}:`);
          debugWalk(child, depth + 2);
        });
      } else {
        debugWalk(node.body, depth + 1);
      }
    }
  }
  
  // Handle specific properties
  if (node.then) {
    console.log(`${indent}Processing then:`);
    debugWalk(node.then, depth + 1);
  }
  if (node.else) {
    console.log(`${indent}Processing else:`);
    debugWalk(node.else, depth + 1);
  }
}

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

console.log('Debug walking JavaScript switch statement:');
console.log('Input code:');
console.log(testCode);

console.log('\nWalking normalized AST:');
const ast = extractJavaScript(testCode);
const normalized = normalizeJavaScript(ast);
debugWalk(normalized);