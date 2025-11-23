import Parser from 'tree-sitter';
import TypeScript from 'tree-sitter-typescript';

/**
 * Extract TypeScript AST using Tree-sitter
 * @param {string} sourceCode - TypeScript source code
 * @returns {Object} - Parsed AST
 */
export function extractTypeScript(sourceCode) {
  try {
    const parser = new Parser();
    // Use the TypeScript parser
    parser.setLanguage(TypeScript.typescript);
    const tree = parser.parse(sourceCode);
    return tree.rootNode;
  } catch (error) {
    console.error('Error extracting TypeScript AST:', error);
    return {
      type: 'ERROR',
      body: []
    };
  }
}