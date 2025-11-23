import Parser from "tree-sitter";
import C from "tree-sitter-c";

export function extractC(code) {
  const parser = new Parser();
  parser.setLanguage(C);
  return parser.parse(code).rootNode;
}