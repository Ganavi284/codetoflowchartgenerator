import Parser from 'tree-sitter';
import Python from 'tree-sitter-python';

/**
 * Extract Python AST using Tree-sitter
 * @param {string} sourceCode - Python source code
 * @returns {Object} - Parsed AST
 */
export function extractPython(sourceCode) {
  try {
    const parser = new Parser();
    parser.setLanguage(Python);
    const tree = parser.parse(sourceCode);
    return tree.rootNode;
  } catch (error) {
    console.error('Error extracting Python AST:', error);
    return {
      type: 'ERROR',
      body: []
    };
  }
}