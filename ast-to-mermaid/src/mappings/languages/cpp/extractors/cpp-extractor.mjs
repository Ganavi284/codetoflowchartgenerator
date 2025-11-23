import Parser from 'tree-sitter';
import CPP from 'tree-sitter-cpp';

/**
 * Extract C++ AST using Tree-sitter
 * @param {string} sourceCode - C++ source code
 * @returns {Object} - Parsed AST
 */
export function extractCpp(sourceCode) {
  try {
    const parser = new Parser();
    parser.setLanguage(CPP);
    const tree = parser.parse(sourceCode);
    return tree.rootNode;
  } catch (error) {
    console.error('Error extracting C++ AST:', error);
    return {
      type: 'ERROR',
      body: []
    };
  }
}