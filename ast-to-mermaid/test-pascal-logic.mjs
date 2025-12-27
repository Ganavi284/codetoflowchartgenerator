import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import fs from 'fs';

console.log('Testing Pascal logic mapping...\n');

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

// Simulate the nodes that would be extracted from our Pascal program
const nodes = [
  { type: 'IO', text: "write('Enter a number: ')" },
  { type: 'IO', text: 'readln(n)' },
  { 
    type: 'If', 
    cond: { text: 'n >= 0' },
    then: { type: 'Block', body: [{ type: 'IO', text: "writeln('Number is Positive')" }] },
    else: { type: 'Block', body: [{ type: 'IO', text: "writeln('Number is Negative')" }] }
  },
  { type: 'IO', text: "writeln('Program completed.')" }
];

// Process each node
nodes.forEach((node, index) => {
  console.log(`Processing node ${index + 1}: ${node.type}`);
  
  switch (node.type) {
    case 'If':
      mapIf(node, context);
      // Simulate processing the then branch
      if (node.then && node.then.body) {
        context.enterBranch('then');
        node.then.body.forEach(stmt => {
          if (stmt.type === 'IO') mapIO(stmt, context);
        });
        context.exitBranch('then');
      }
      // Simulate processing the else branch
      if (node.else && node.else.body) {
        context.enterBranch('else');
        node.else.body.forEach(stmt => {
          if (stmt.type === 'IO') mapIO(stmt, context);
        });
        context.exitBranch('else');
      }
      // Complete the if statement
      if (typeof context.completeIf === 'function') {
        context.completeIf();
      }
      break;
      
    case 'IO':
      mapIO(node, context);
      break;
  }
});

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Resolve any pending joins to the end node
if (typeof context.resolvePendingJoins === 'function') {
  context.resolvePendingJoins(endId);
}

// Connect last node to end node if there are no pending joins
if (context.last && !context.pendingJoins) {
  context.addEdge(context.last, endId);
}

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('Generated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-logic-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);