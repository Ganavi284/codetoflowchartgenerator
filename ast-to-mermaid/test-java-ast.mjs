import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';
import fs from 'fs';

const sourceCode = fs.readFileSync('test-java.java', 'utf8');

const parser = new Parser();
parser.setLanguage(Java);
const tree = parser.parse(sourceCode);

function printNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}${node.type}: "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"`);
  
  if (node.children && node.children.length > 0 && depth < 5) {
    for (let i = 0; i < Math.min(node.children.length, 10); i++) {
      printNode(node.children[i], depth + 1);
    }
    if (node.children.length > 10) {
      console.log(`${'  '.repeat(depth + 1)}... and ${node.children.length - 10} more children`);
    }
  }
}

// Navigate to the main method block
const program = tree.rootNode;
const classDeclaration = program?.child(0);
const classBody = classDeclaration?.child(3); // class_body is at index 3
const methodDeclaration = classBody?.child(1); // method_declaration is at index 1 (after {)
const block = methodDeclaration?.child(4); // block is at index 4

console.log('Block:', block?.type);

if (block) {
  console.log('Main method block:');
  printNode(block);
}