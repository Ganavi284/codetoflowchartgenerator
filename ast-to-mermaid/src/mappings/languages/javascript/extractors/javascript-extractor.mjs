import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';

/**
 * Extract JavaScript AST using Tree-sitter
 * @param {string} sourceCode - JavaScript source code
 * @returns {Object} - Parsed AST
 */
export function extractJavaScript(sourceCode) {
  try {
    const parser = new Parser();
    parser.setLanguage(JavaScript);
    const tree = parser.parse(sourceCode);
    return tree.rootNode;
  } catch (error) {
    console.error('Error extracting JavaScript AST:', error);
    return {
      type: 'ERROR',
      body: []
    };
  }
}