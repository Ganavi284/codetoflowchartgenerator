import Parser from 'tree-sitter';

console.log('Testing locally cloned parsers...');

// Test Fortran parser (locally cloned)
try {
  const fortranModule = await import('./parsers/tree-sitter-fortran/bindings/node/index.js');
  const fortranParser = new Parser();
  fortranParser.setLanguage(fortranModule.default.language);
  const fortranSourceCode = 'program test\\n  implicit none\\n  integer :: x\\n  x = 1\\nend program test';
  const fortranTree = fortranParser.parse(fortranSourceCode);
  console.log('✅ Fortran parser working');
} catch (error) {
  console.log('❌ Fortran parser failed:', error.message);
}

// Test Pascal parser (locally cloned)
try {
  const pascalModule = await import('./parsers/tree-sitter-pascal/bindings/node/index.js');
  const pascalParser = new Parser();
  pascalParser.setLanguage(pascalModule.default.language);
  const pascalSourceCode = 'program Test;\\nbegin\\n  writeln(\"Hello\");\\nend.';
  const pascalTree = pascalParser.parse(pascalSourceCode);
  console.log('✅ Pascal parser working');
} catch (error) {
  console.log('❌ Pascal parser failed:', error.message);
}