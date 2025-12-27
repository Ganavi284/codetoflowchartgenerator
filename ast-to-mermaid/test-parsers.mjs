import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import TypeScriptTS from 'tree-sitter-typescript/bindings/node/typescript.js';
import TypeScriptTSX from 'tree-sitter-typescript/bindings/node/tsx.js';
import Java from 'tree-sitter-java';
import C from 'tree-sitter-c';
import CPP from 'tree-sitter-cpp';
import Python from 'tree-sitter-python';

console.log('Testing installed parsers...');

// Test JavaScript parser
try {
  const jsParser = new Parser();
  jsParser.setLanguage(JavaScript);
  const jsSourceCode = 'let x = 1;';
  const jsTree = jsParser.parse(jsSourceCode);
  console.log('✅ JavaScript parser working');
} catch (error) {
  console.log('❌ JavaScript parser failed:', error.message);
}

// Test TypeScript parser
try {
  const tsParser = new Parser();
  tsParser.setLanguage(TypeScriptTS);
  const tsSourceCode = 'let x: number = 1;';
  const tsTree = tsParser.parse(tsSourceCode);
  console.log('✅ TypeScript parser working');
} catch (error) {
  console.log('❌ TypeScript parser failed:', error.message);
}

// Test TSX parser
try {
  const tsxParser = new Parser();
  tsxParser.setLanguage(TypeScriptTSX);
  const tsxSourceCode = '<div>Hello</div>';
  const tsxTree = tsxParser.parse(tsxSourceCode);
  console.log('✅ TSX parser working');
} catch (error) {
  console.log('❌ TSX parser failed:', error.message);
}

// Test Java parser
try {
  const javaParser = new Parser();
  javaParser.setLanguage(Java);
  const javaSourceCode = 'class Test { int x = 1; }';
  const javaTree = javaParser.parse(javaSourceCode);
  console.log('✅ Java parser working');
} catch (error) {
  console.log('❌ Java parser failed:', error.message);
}

// Test C parser
try {
  const cParser = new Parser();
  cParser.setLanguage(C);
  const cSourceCode = 'int x = 1;';
  const cTree = cParser.parse(cSourceCode);
  console.log('✅ C parser working');
} catch (error) {
  console.log('❌ C parser failed:', error.message);
}

// Test C++ parser
try {
  const cppParser = new Parser();
  cppParser.setLanguage(CPP);
  const cppSourceCode = 'int x = 1;';
  const cppTree = cppParser.parse(cppSourceCode);
  console.log('✅ C++ parser working');
} catch (error) {
  console.log('❌ C++ parser failed:', error.message);
}

// Test Python parser
try {
  const pythonParser = new Parser();
  pythonParser.setLanguage(Python);
  const pythonSourceCode = 'x = 1';
  const pythonTree = pythonParser.parse(pythonSourceCode);
  console.log('✅ Python parser working');
} catch (error) {
  console.log('❌ Python parser failed:', error.message);
}

console.log('\nTesting locally cloned parsers...');

// Test Fortran parser (locally cloned)
try {
  import('./parsers/tree-sitter-fortran/bindings/node/index.js').then(module => {
    const Fortran = module.default || module;
    const fortranParser = new Parser();
    fortranParser.setLanguage(Fortran);
    const fortranSourceCode = 'program test\\n  implicit none\\n  integer :: x\\n  x = 1\\nend program test';
    const fortranTree = fortranParser.parse(fortranSourceCode);
    console.log('✅ Fortran parser working');
  }).catch(error => {
    console.log('❌ Fortran parser failed:', error.message);
  });
} catch (error) {
  console.log('❌ Fortran parser failed:', error.message);
}

// Test Pascal parser (locally cloned)
try {
  import('./parsers/tree-sitter-pascal/bindings/node/index.js').then(module => {
    const Pascal = module.default || module;
    const pascalParser = new Parser();
    pascalParser.setLanguage(Pascal);
    const pascalSourceCode = 'program Test;\\nbegin\\n  writeln(\"Hello\");\\nend.';
    const pascalTree = pascalParser.parse(pascalSourceCode);
    console.log('✅ Pascal parser working');
  }).catch(error => {
    console.log('❌ Pascal parser failed:', error.message);
  });
} catch (error) {
  console.log('❌ Pascal parser failed:', error.message);
}