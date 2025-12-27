import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import fs from 'fs';

console.log('Testing Pascal logic mapping with proper context...\n');

// Create context
const context = ctx();

console.log('Building flowchart for Pascal program...\n');

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

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
// Looking at the mapIf implementation, it should have registered the if statement
console.log('IF stack length:', context.ifStack ? context.ifStack.length : 0);

// 4. Process the then branch: writeln('Number is Positive')
console.log('Entering then branch...');
if (typeof context.enterBranch === 'function') {
  context.enterBranch('then');
}
mapIO({ type: 'IO', text: "writeln('Number is Positive')" }, context);
if (typeof context.exitBranch === 'function') {
  context.exitBranch('then');
}

// 5. Process the else branch: writeln('Number is Negative')
console.log('Entering else branch...');
if (typeof context.enterBranch === 'function') {
  context.enterBranch('else');
}
mapIO({ type: 'IO', text: "writeln('Number is Negative')" }, context);
if (typeof context.exitBranch === 'function') {
  context.exitBranch('else');
}

// 6. Complete the if statement
console.log('Completing if statement...');
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
console.log('Resolving pending joins...');
if (typeof context.resolvePendingJoins === 'function') {
  context.resolvePendingJoins(endId);
}

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-walker-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);