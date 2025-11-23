import Parser from "tree-sitter";
import C from "tree-sitter-c";

/**
 * Dynamic Tree-sitter parser for C code
 * @param {string} code - C source code
 * @returns {Object} - Parsed AST root node
 */
export function extractC(code) {
  const parser = new Parser();
  parser.setLanguage(C);
  return parser.parse(code).rootNode;
}