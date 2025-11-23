import fs from 'fs';

// Read the generated diagram
const diagram = fs.readFileSync('complex-diagram.mmd', 'utf8');

console.log('C Code AST Visualization');
console.log('=======================');
console.log('Total nodes in diagram:', diagram.split('\n').length - 1);
console.log();

// Show structure overview
console.log('Diagram structure (first 20 nodes):');
console.log('-----------------------------------');
const lines = diagram.split('\n');
for (let i = 1; i <= Math.min(20, lines.length - 1); i++) {
  console.log(`${i.toString().padStart(3, ' ')}: ${lines[i]}`);
}

console.log();
console.log('...');
console.log(`(Showing ${Math.min(20, lines.length - 1)} of ${lines.length - 1} total nodes)`);

console.log();
console.log('Node type distribution:');
console.log('----------------------');

// Count node types
const nodeTypes = {};
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (line && line.includes('[[')) {
    const typeMatch = line.match(/\[\[(.*?)\]\]/);
    if (typeMatch) {
      const type = typeMatch[1];
      nodeTypes[type] = (nodeTypes[type] || 0) + 1;
    }
  }
}

// Sort and display
const sortedTypes = Object.entries(nodeTypes)
  .sort((a, b) => b[1] - a[1]);
  
for (const [type, count] of sortedTypes) {
  console.log(`${type.padEnd(25)}: ${count.toString().padStart(3)}`);
}

console.log();
console.log('Diagram saved to: complex-diagram.mmd');
console.log('You can visualize it using any Mermaid-compatible viewer.');