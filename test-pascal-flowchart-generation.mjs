import { extractPascal } from './ast-to-mermaid/src/mappings/languages/pascal/extractors/pascal-extractor.mjs';
import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';
import { walk } from './ast-to-mermaid/src/mappings/languages/pascal/walkers/walk.mjs';
import { ctx } from './ast-to-mermaid/src/mappings/languages/pascal/mermaid/context.mjs';

const testCode = `
program TestLoops;
var
  i, j: integer;
begin
  for i := 1 to 3 do
    writeln('For loop: ', i);
    
  j := 0;
  while j < 2 do
  begin
    writeln('While loop: ', j);
    j := j + 1;
  end;
  
  writeln('Program completed');
end.
`;

console.log('Testing Pascal flowchart generation with loops...');

// Create context
const context = ctx();

// Add handle function to context
context.handle = function(node) {
  console.log(`Handling node of type: ${node.type}`);
  
  // Import the mapping functions dynamically
  if (node.type === 'For') {
    // Simulate the mapping - create initialization node
    const initId = context.next();
    const initText = node.init?.text ? node.init.text.split(' ')[0] + ' := ' + node.init.text.split(' ')[2] : 'init';
    context.add(initId, `[${initText}]`);
    
    // Create condition node
    const condId = context.next();
    const condText = node.cond?.text || 'condition';
    context.add(condId, `{"${condText}"}`);
    
    // Connect init to condition
    if (context.last) {
      context.addEdge(context.last, condId);
    }
    context.last = condId;
    
    console.log(`Mapped For loop with init: ${initText}, condition: ${condText}`);
  } else if (node.type === 'While') {
    const whileId = context.next();
    const whileText = node.cond?.text || 'condition';
    context.add(whileId, `{"while ${whileText}"}`);
    
    if (context.last) {
      context.addEdge(context.last, whileId);
    }
    context.last = whileId;
    
    console.log(`Mapped While loop with condition: ${whileText}`);
  } else if (node.type === 'IO') {
    const ioId = context.next();
    context.add(ioId, `[/"${node.text}"/]`);
    
    if (context.last) {
      context.addEdge(context.last, ioId);
    }
    context.last = ioId;
    
    console.log(`Mapped IO: ${node.text}`);
  }
};

// Add start node
const startId = context.next();
context.add(startId, '(["start"])');
context.last = startId;

try {
  const ast = extractPascal(testCode);
  const normalized = normalizePascal(ast);
  
  console.log('Normalized AST processed. Walking AST...');
  walk(normalized, context);
  
  // Add end node
  const endId = context.next();
  context.add(endId, '(["end"])');
  
  // Emit the diagram
  const diagram = context.emit();
  console.log('\nGenerated Mermaid diagram:');
  console.log(diagram);
  
  console.log('\nTest completed successfully');
} catch (error) {
  console.error('Error during flowchart generation:', error);
}