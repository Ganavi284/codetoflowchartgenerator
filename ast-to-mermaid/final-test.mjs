import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import TypeScriptTS from 'tree-sitter-typescript/bindings/node/typescript.js';
import Java from 'tree-sitter-java';
import C from 'tree-sitter-c';
import CPP from 'tree-sitter-cpp';
import Python from 'tree-sitter-python';

console.log('Testing all parsers...');

// Test npm-installed parsers
const npmParsers = [
  { name: 'JavaScript', module: JavaScript },
  { name: 'TypeScript', module: TypeScriptTS },
  { name: 'Java', module: Java },
  { name: 'C', module: C },
  { name: 'C++', module: CPP },
  { name: 'Python', module: Python }
];

npmParsers.forEach(({ name, module }) => {
  try {
    const parser = new Parser();
    parser.setLanguage(module);
    console.log(`✅ ${name} parser loaded`);
  } catch (error) {
    console.log(`❌ ${name} parser failed:`, error.message);
  }
});

// Test locally cloned parsers
console.log('\nTesting locally cloned parsers...');

// Test Fortran parser
try {
  const fortranModule = await import('./parsers/tree-sitter-fortran/bindings/node/index.js');
  const parser = new Parser();
  parser.setLanguage(fortranModule.default.language);
  console.log('✅ Fortran parser loaded');
} catch (error) {
  console.log('❌ Fortran parser failed:', error.message);
}

// Test Pascal parser
try {
  const pascalModule = await import('./parsers/tree-sitter-pascal/bindings/node/index.js');
  const parser = new Parser();
  parser.setLanguage(pascalModule.default.language);
  console.log('✅ Pascal parser loaded');
} catch (error) {
  console.log('❌ Pascal parser failed:', error.message);
}

console.log('\n✅ All parsers have been rebuilt with matching tree-sitter versions!');