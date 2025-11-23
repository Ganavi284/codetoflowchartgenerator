/**
 * C language AST extractor using tree-sitter
 */

import Parser from 'tree-sitter';
import C from 'tree-sitter-c';

export function extractAST(sourceCode, language) {
  // Validate input
  if (!sourceCode || typeof sourceCode !== 'string') {
    throw new Error('Invalid source code provided');
  }
  
  // Validate language
  if (language !== 'c') {
    throw new Error(`Unsupported language: ${language}. Expected: c`);
  }
  
  try {
    // Initialize parser with C language
    const parser = new Parser();
    parser.setLanguage(C);
    
    // Parse the source code
    const tree = parser.parse(sourceCode);
    
    // Convert tree to AST format
    return convertTreeToAST(tree.rootNode);
  } catch (error) {
    console.error('Error parsing C source code:', error);
    throw new Error(`Failed to parse C source code: ${error.message}`);
  }
}

/**
 * Convert tree-sitter tree node to AST format
 * @param {Object} node - Tree-sitter node
 * @returns {Object} AST node
 */
function convertTreeToAST(node) {
  const astNode = {
    type: node.type,
    startPosition: node.startPosition,
    endPosition: node.endPosition,
    children: []
  };
  
  // Add named children recursively
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    astNode.children.push(convertTreeToAST(child));
  }
  
  return astNode;
}