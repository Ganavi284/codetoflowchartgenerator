import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';

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
  if (node.type === 'IO') {
    const ioId = context.next();
    context.add(ioId, `[/"${node.text}"/]`);
    if (context.last) {
      context.addEdge(context.last, ioId);
    }
    context.last = ioId;
  } else if (node.type === 'If') {
    const conditionId = context.next();
    context.add(conditionId, `{"if ${node.cond.text}"}`);
    if (context.last) {
      context.addEdge(context.last, conditionId);
    }
    context.last = conditionId;
  }
};

console.log('\n--- Walking mock node ---');
walk(mockNode, context);

console.log('\nContext nodes:', context.nodes);
console.log('Context edges:', context.edges);