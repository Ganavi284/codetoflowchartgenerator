import Parser from 'tree-sitter';
import FortranModule from './parsers/tree-sitter-fortran/bindings/node/index.js';

console.log('FortranModule keys:', Object.keys(FortranModule));
console.log('FortranModule.default keys:', FortranModule.default ? Object.keys(FortranModule.default) : 'no default');

// Extract the language from the module
const Fortran = FortranModule.default?.language || FortranModule.language || FortranModule.default || FortranModule;
console.log('Fortran language object type:', typeof Fortran);

const parser = new Parser();
console.log('Setting language...');
try {
  parser.setLanguage(Fortran);
  console.log('Language set successfully');
  
  const sourceCode = `
program hello
    implicit none
    integer :: x = 10
end program hello
  `;
  
  console.log('Parsing source code...');
  const tree = parser.parse(sourceCode);
  console.log('Tree created successfully');
  
  // Try different ways to access the root node
  console.log('Tree keys:', Object.keys(tree));
  
  // Try to access rootNode safely
  try {
    console.log('Trying to access tree.rootNode...');
    const rootNode = tree.rootNode;
    console.log('Root node accessed successfully:', typeof rootNode);
  } catch (error) {
    console.error('Error accessing tree.rootNode:', error.message);
  }
  
  // Try to use the walk method if available
  try {
    console.log('Trying to use tree.walk()...');
    const cursor = tree.walk();
    console.log('Cursor created successfully:', typeof cursor);
    cursor.delete();
  } catch (error) {
    console.error('Error using tree.walk():', error.message);
  }
  
} catch (error) {
  console.error('Error setting language or parsing:', error.message);
}