import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';
import { mapIf } from './ast-to-mermaid/src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './ast-to-mermaid/src/mappings/languages/pascal/io/io.mjs';

// Create context
const context = ctx();

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

// Create IO nodes first
console.log('Creating IO nodes...');

// write('Enter a number: ')
mapIO({ type: 'IO', text: "write('Enter a number: ')" }, context);

// readln(n)
mapIO({ type: 'IO', text: 'readln(n)' }, context);

// Create if statement
console.log('Creating if statement...');
const ifNode = { 
  type: 'If', 
  cond: { text: 'n >= 0' },
  else: true // has else branch
};
mapIf(ifNode, context);

// Manually register the if statement
if (typeof context.registerIf === 'function') {
  context.registerIf('N4', true); // N4 is the condition node
}

// Process then branch
console.log('Processing then branch...');
if (typeof context.enterBranch === 'function') {
  context.enterBranch('then');
}
mapIO({ type: 'IO', text: "writeln('Number is Positive')" }, context);
if (typeof context.exitBranch === 'function') {
  context.exitBranch('then');
}

// Process else branch
console.log('Processing else branch...');
if (typeof context.enterBranch === 'function') {
  context.enterBranch('else');
}
mapIO({ type: 'IO', text: "writeln('Number is Negative')" }, context);
if (typeof context.exitBranch === 'function') {
  context.exitBranch('else');
}

// Complete the if statement
console.log('Completing if statement...');
if (typeof context.completeIf === 'function') {
  context.completeIf();
}

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve pending joins
if (typeof context.resolvePendingJoins === 'function') {
  context.resolvePendingJoins(endId);
}

console.log('\nContext nodes:', context.nodes);
console.log('Context edges:', context.edges);

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('\nGenerated Mermaid diagram:');
console.log(mermaidDiagram);