import Parser from 'tree-sitter';

console.log('Detailed debugging of parser exports...');

// Test Fortran parser (locally cloned)
try {
  const fortranModule = await import('./parsers/tree-sitter-fortran/bindings/node/index.js');
  console.log('Fortran module loaded successfully');
  console.log('Fortran default:', fortranModule.default);
  console.log('Fortran default type:', typeof fortranModule.default);
  if (fortranModule.default) {
    console.log('Fortran default.language:', fortranModule.default.language);
    console.log('Fortran default.language type:', typeof fortranModule.default.language);
    console.log('Fortran default.name:', fortranModule.default.name);
    
    // Try to create parser
    try {
      const fortranParser = new Parser();
      console.log('Fortran parser created');
      fortranParser.setLanguage(fortranModule.default.language);
      console.log('Fortran language set');
      const fortranSourceCode = 'program test\n  implicit none\n  integer :: x\n  x = 1\nend program test';
      const fortranTree = fortranParser.parse(fortranSourceCode);
      console.log('Fortran parsing successful');
      console.log('✅ Fortran parser working');
    } catch (parserError) {
      console.log('Fortran parser error:', parserError.message);
      console.log('Fortran parser error stack:', parserError.stack);
    }
  }
} catch (error) {
  console.log('Fortran import failed:', error.message);
  console.log('Fortran import error stack:', error.stack);
}

// Test Pascal parser (locally cloned)
try {
  const pascalModule = await import('./parsers/tree-sitter-pascal/bindings/node/index.js');
  console.log('Pascal module loaded successfully');
  console.log('Pascal default:', pascalModule.default);
  console.log('Pascal default type:', typeof pascalModule.default);
  if (pascalModule.default) {
    console.log('Pascal default.language:', pascalModule.default.language);
    console.log('Pascal default.language type:', typeof pascalModule.default.language);
    console.log('Pascal default.name:', pascalModule.default.name);
    
    // Try to create parser
    try {
      const pascalParser = new Parser();
      console.log('Pascal parser created');
      pascalParser.setLanguage(pascalModule.default.language);
      console.log('Pascal language set');
      const pascalSourceCode = 'program Test;\nbegin\n  writeln("Hello");\nend.';
      const pascalTree = pascalParser.parse(pascalSourceCode);
      console.log('Pascal parsing successful');
      console.log('✅ Pascal parser working');
    } catch (parserError) {
      console.log('Pascal parser error:', parserError.message);
      console.log('Pascal parser error stack:', parserError.stack);
    }
  }
} catch (error) {
  console.log('Pascal import failed:', error.message);
  console.log('Pascal import error stack:', error.stack);
}