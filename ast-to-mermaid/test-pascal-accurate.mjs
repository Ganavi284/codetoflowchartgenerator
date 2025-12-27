import { mapIf } from './src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './src/mappings/languages/pascal/io/io.mjs';
import { ctx } from './src/mappings/languages/pascal/mermaid/context.mjs';
import { walk } from './src/mappings/languages/pascal/walkers/walk.mjs';
import fs from 'fs';

console.log('Testing Pascal logic mapping with accurate walker simulation...\n');

// Create context
const context = ctx();

// Add handle function to context (normally done by the walker)
context.handle = function(node) {
  console.log(`Handling node of type: ${node.type}`);
  // Map the node based on its type
  switch (node.type) {
    case 'IO':
      return mapIO(node, context);
    case 'If':
      return mapIf(node, context);
  }
};

console.log('Building flowchart for Pascal program...\n');

// Create a mock AST that represents our Pascal program
const mockAST = {
  type: 'Program',
  body: [
    { type: 'IO', text: "write('Enter a number: ')" },
    { type: 'IO', text: 'readln(n)' },
    { 
      type: 'If', 
      cond: { text: 'n >= 0' },
      then: { 
        type: 'Block', 
        body: [
          { type: 'IO', text: "writeln('Number is Positive')" }
        ] 
      },
      else: { 
        type: 'Block', 
        body: [
          { type: 'IO', text: "writeln('Number is Negative')" }
        ] 
      }
    },
    { type: 'IO', text: "writeln('Program completed.')" }
  ]
};

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

// Walk the mock AST
if (mockAST.body) {
  mockAST.body.forEach(statement => {
    walk(statement, context);
  });
}

// Add end node
const endId = context.next();
context.add(endId, '(["end"])');

// Connect last node to end node
if (context.last) {
  context.addEdge(context.last, endId);
}

// Emit the final diagram
const mermaidDiagram = context.emit();
console.log('Generated Mermaid diagram:');
console.log(mermaidDiagram);

// Save to output file
const outputFile = './pascal-accurate-output.mmd';
fs.writeFileSync(outputFile, mermaidDiagram);
console.log(`\nMermaid diagram saved to: ${outputFile}`);