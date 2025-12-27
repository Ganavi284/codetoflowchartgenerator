import { normalizePascal } from './ast-to-mermaid/src/mappings/languages/c/src/mappings/languages/pascal/normalizer/normalize-pascal.mjs';

// Test with a simple ifElse node from the extracted AST
const ifElseNode = {
  "type": "ifElse",
  "cond": {
    "text": "n >= 0"
  },
  "then": {
    "type": "Block",
    "body": [
      {
        "type": "exprCall",
        "text": "writeln('Number is Positive')"
      }
    ]
  },
  "else": {
    "type": "Block",
    "body": [
      {
        "type": "exprCall",
        "text": "writeln('Number is Negative')"
      }
    ]
  },
  "sourceCode": "program CheckNumber;\nvar\n  n: integer;\nbegin\n  write('Enter a number: ');\n  readln(n);\n\n  if n >= 0 then\n    writeln('Number is Positive')\n  else\n    writeln('Number is Negative');\nend."
};

console.log('Input ifElse node:');
console.log(JSON.stringify(ifElseNode, null, 2));

const normalized = normalizePascal(ifElseNode);
console.log('\nNormalized node:');
console.log(JSON.stringify(normalized, null, 2));