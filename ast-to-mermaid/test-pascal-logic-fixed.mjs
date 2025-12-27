import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import fs from 'fs';

console.log('Testing Pascal logic mapping with proper branching...\n');

// Create a mock context
const context = ctx();

// Add handle function to context (normally done by the walker)
context.handle = function(node) {
  console.log(`Handling node of type: ${node.type}`);
};

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

console.log('Creating nodes for Pascal program...\n');

// Process IO operations before the if statement
console.log('Processing IO operations before if statement...');
mapIO({ type: 'IO', text: "write('Enter a number: ')" }, context);
mapIO({ type: 'IO', text: 'readln(n)' }, context);

// Process the if statement
console.log('Processing if statement...');
const ifNode = { 
  type: 'If', 
  cond: { text: 'n >= 0' },
  else: true  // Has else branch
};
mapIf(ifNode, context);

// Register the if statement in the context
if (typeof context.registerIf === 'function') {
  context.registerIf('N4', true); // N4 is the condition node, has else branch
}

// Process the then branch
console.log('Processing then branch...');
context.enterBranch('then');
mapIO({ type: 'IO', text: "writeln('Number is Positive')" }, context);
context.exitBranch('then');

// Process the else branch
console.log('Processing else branch...');
context.enterBranch('else');
mapIO({ type: 'IO', text: "writeln('Number is Negative')" }, context);
context.exitBranch('else');

// Complete the if statement
console.log('Completing if statement...');
if (typeof context.completeIf === 'function') {
  context.completeIf();
}

// Process IO operation after the if statement
console.log('Processing IO operation after if statement...');
mapIO({ type: 'IO', text: "writeln('Program completed.')" }, context);

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve any pending joins to the end node
console.log('Resolving pending joins...');
if (typeof context.resolvePendingJoins === 'function') {
  context.resolvePendingJoins(endId);
}

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-logic-fixed-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);