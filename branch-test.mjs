import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';
import { mapIf } from './ast-to-mermaid/src/mappings/languages/pascal/conditional/if.mjs';
import { mapIO } from './ast-to-mermaid/src/mappings/languages/pascal/io/io.mjs';

// Create a mock node structure similar to our if statement
const mockNode = {
  type: 'If',
  cond: { text: 'n >= 0' },
  then: {
    type: 'Block',
    body: [
      {
        type: 'IO',
        text: "writeln('Number is Positive')"
      }
    ]
  },
  else: {
    type: 'Block',
    body: [
      {
        type: 'IO',
        text: "writeln('Number is Negative')"
      }
    ]
  }
};

console.log('Mock node:', JSON.stringify(mockNode, null, 2));

// Create context
const context = ctx();

// Add handle function to context
context.handle = function(node) {
  console.log('Context handling node of type:', node.type);
  switch (node.type) {
    case 'IO':
      return mapIO(node, context);
    case 'If':
      return mapIf(node, context);
  }
};

// Manually set the start node
context.add('N1', '(["start"])');
context.setLast('N1');

console.log('\n--- Walking mock node ---');
walk(mockNode, context);

console.log('\nContext nodes:', context.nodes);
console.log('Context edges:', context.edges);