import Parser from 'tree-sitter';
import FortranModule from './parsers/tree-sitter-fortran/bindings/node/index.js';

// Extract the language from the module
const Fortran = FortranModule.default?.language || FortranModule.language || FortranModule.default || FortranModule;

console.log('Fortran language object:', typeof Fortran);

const parser = new Parser();
console.log('Setting language...');
parser.setLanguage(Fortran);
console.log('Language set successfully');

const sourceCode = `
program hello
    implicit none
    integer :: x = 10
    
    if (x > 0) then
        print *, 'x is positive'
    else
        print *, 'x is not positive'
    end if
end program hello
`;

console.log('Parsing source code...');
try {
  const tree = parser.parse(sourceCode);
  console.log('Tree object created successfully');
  console.log('Tree type:', typeof tree);
  
  // Let's try to access properties safely
  if (tree) {
    console.log('Tree has input:', 'input' in tree);
    console.log('Tree has getText:', 'getText' in tree);
    console.log('Tree has language:', 'language' in tree);
    console.log('Tree has rootNode:', 'rootNode' in tree);
    
    // Try to access methods safely
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(tree));
    console.log('Tree methods:', methods);
    
    // Now try to access the rootNode
    console.log('Accessing rootNode...');
    const rootNode = tree.rootNode;
    console.log('Root node type:', typeof rootNode);
    console.log('Root node:', rootNode);
  }
} catch (error) {
  console.error('Error parsing source code:', error.message);
  console.error('Error stack:', error.stack);
}