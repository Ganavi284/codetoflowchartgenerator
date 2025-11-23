import Parser from 'tree-sitter';
import Java from 'tree-sitter-java';

/**
 * Extract Java AST from source code
 * @param {string} sourceCode - Java source code
 * @returns {Object} - Tree-sitter AST
 */
export function extractJava(sourceCode) {
  try {
    const parser = new Parser();
    parser.setLanguage(Java);
    
    // Try to parse the code as-is first
    let ast = parser.parse(sourceCode);
    
    // If the parse tree is empty or has errors, try wrapping in a class
    if (!ast || !ast.rootNode || ast.rootNode.hasError()) {
      // Check if this is already a complete Java file with class
      if (!sourceCode.includes('class ') && !sourceCode.includes('public ')) {
        // Wrap simple statements in a class and method for parsing
        const wrappedCode = `
public class TempClass {
  public static void main(String[] args) {
    ${sourceCode}
  }
}`;
        ast = parser.parse(wrappedCode);
      }
    }
    
    return ast;
  } catch (error) {
    console.error('Error parsing Java code:', error);
    return null;
  }
}