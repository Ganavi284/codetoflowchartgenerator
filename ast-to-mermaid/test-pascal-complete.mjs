import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import fs from 'fs';

console.log('Testing complete Pascal logic mapping...\n');

// Create a mock context
const context = ctx();

// Add handle function to context (normally done by the walker)
context.handle = function(node) {
  console.log(`Handling node of type: ${node.type}`);
};

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

console.log('Building flowchart for Pascal program...\n');

// 1. write('Enter a number: ')
mapIO({ type: 'IO', text: "write('Enter a number: ')" }, context);

// 2. readln(n)
mapIO({ type: 'IO', text: 'readln(n)' }, context);

// 3. if n >= 0 then
const ifNode = { 
  type: 'If', 
  cond: { text: 'n >= 0' },
  else: true  // Has else branch
};
mapIf(ifNode, context);

// Manually register the if statement (this is normally done by mapIf)
if (typeof context.registerIf === 'function') {
  context.registerIf('N4', true); // Assuming N4 is the condition node
}

// 4. writeln('Number is Positive') in then branch
context.enterBranch('then');
mapIO({ type: 'IO', text: "writeln('Number is Positive')" }, context);
context.exitBranch('then');

// 5. writeln('Number is Negative') in else branch
context.enterBranch('else');
mapIO({ type: 'IO', text: "writeln('Number is Negative')" }, context);
context.exitBranch('else');

// 6. Complete the if statement
if (typeof context.completeIf === 'function') {
  const frame = context.completeIf();
  console.log('Completed if statement:', frame);
}

// 7. writeln('Program completed.')
mapIO({ type: 'IO', text: "writeln('Program completed.')" }, context);

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve any pending joins to the end node
console.log('Resolving pending joins to end node...');
if (typeof context.resolvePendingJoins === 'function') {
  const resolved = context.resolvePendingJoins(endId);
  console.log('Resolved pending joins:', resolved);
}

// If there's still a last node, connect it to the end
if (context.last) {
  console.log('Connecting last node to end:', context.last);
  context.addEdge(context.last, endId);
}

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-complete-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);