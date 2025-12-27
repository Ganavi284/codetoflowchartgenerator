import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import fs from 'fs';

console.log('Testing Pascal logic mapping with final approach...\n');

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

// Check the current if frame
const currentIf = context.currentIf();
console.log('Current IF frame:', currentIf);

// 4. Process the then branch: writeln('Number is Positive')
console.log('Processing then branch...');
context.enterBranch('then');

// Check if we're in the then branch
console.log('Active branch after enterBranch:', context.currentIf()?.activeBranch);

// Process IO in then branch
mapIO({ type: 'IO', text: "writeln('Number is Positive')" }, context);

// Check the branch state
const thenFrame = context.currentIf();
console.log('Then branch state:', thenFrame?.then);

context.exitBranch('then');

// 5. Process the else branch: writeln('Number is Negative')
console.log('Processing else branch...');
context.enterBranch('else');

// Check if we're in the else branch
console.log('Active branch after enterBranch:', context.currentIf()?.activeBranch);

// Process IO in else branch
mapIO({ type: 'IO', text: "writeln('Number is Negative')" }, context);

// Check the branch state
const elseFrame = context.currentIf();
console.log('Else branch state:', elseFrame?.else);

context.exitBranch('else');

// 6. Complete the if statement
console.log('Completing if statement...');
const completedFrame = context.completeIf();
console.log('Completed frame:', completedFrame);

// 7. writeln('Program completed.')
mapIO({ type: 'IO', text: "writeln('Program completed.')" }, context);

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve any pending joins to the end node
console.log('Resolving pending joins...');
context.resolvePendingJoins(endId);

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-final-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);