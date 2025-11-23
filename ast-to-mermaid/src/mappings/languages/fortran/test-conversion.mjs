/**
 * Test file to demonstrate Fortran to Mermaid conversion
 */

import { mapFortranProgram } from './fortran.mjs';
import { getFortranExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our Fortran example
const mockAST = {
  type: 'Program',
  name: 'main',
  body: {
    type: 'BlockStatement',
    body: [
      // Variable declarations
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { name: 'i' },
            init: null
          },
          {
            type: 'VariableDeclarator',
            id: { name: 'sum' },
            init: { type: 'Literal', value: 0 }
          }
        ]
      },
      // Do loop (Fortran's for loop)
      {
        type: 'DoLoop',
        init: {
          type: 'AssignmentExpression',
          left: { name: 'i' },
          right: { type: 'Literal', value: 0 }
        },
        test: {
          type: 'BinaryExpression',
          operator: '<=',
          left: { name: 'i' },
          right: { type: 'Literal', value: 4 }
        },
        update: {
          type: 'UpdateExpression',
          operator: '++',
          argument: { name: 'i' }
        },
        body: {
          type: 'BlockStatement',
          body: [
            // sum = sum + i;
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: { name: 'sum' },
                right: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: { name: 'sum' },
                  right: { name: 'i' }
                }
              }
            },
            // If statement
            {
              type: 'IfStatement',
              test: {
                type: 'BinaryExpression',
                operator: '>',
                left: { name: 'i' },
                right: { type: 'Literal', value: 2 }
              },
              consequent: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: { name: 'print' },
                      arguments: []
                    }
                  }
                ]
              },
              alternate: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: { name: 'print' },
                      arguments: []
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      // While loop
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { name: 'j' },
            init: { type: 'Literal', value: 0 }
          }
        ]
      },
      {
        type: 'DoWhileLoop',
        test: {
          type: 'BinaryExpression',
          operator: '<',
          left: { name: 'j' },
          right: { type: 'Literal', value: 3 }
        },
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { name: 'print' },
                arguments: []
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: { name: 'j' },
                right: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: { name: 'j' },
                  right: { type: 'Literal', value: 1 }
                }
              }
            }
          ]
        }
      },
      // Do loop with exit (Fortran's do-while)
      {
        type: 'VariableDeclaration',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { name: 'k' },
            init: { type: 'Literal', value: 0 }
          }
        ]
      },
      {
        type: 'DoLoop',
        body: {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { name: 'print' },
                arguments: []
              }
            },
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: { name: 'k' },
                right: {
                  type: 'BinaryExpression',
                  operator: '+',
                  left: { name: 'k' },
                  right: { type: 'Literal', value: 1 }
                }
              }
            },
            // Exit statement
            {
              type: 'IfStatement',
              test: {
                type: 'BinaryExpression',
                operator: '>=',
                left: { name: 'k' },
                right: { type: 'Literal', value: 2 }
              },
              consequent: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExitStatement'
                  }
                ]
              }
            }
          ]
        }
      },
      // Select case (Fortran's switch)
      {
        type: 'SelectCase',
        discriminant: { name: 'sum' },
        cases: [
          {
            test: { type: 'Literal', value: 0 },
            consequent: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: { name: 'print' },
                  arguments: []
                }
              }
            ]
          },
          {
            test: { type: 'Literal', value: 10 },
            consequent: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: { name: 'print' },
                  arguments: []
                }
              }
            ]
          },
          {
            test: null,
            consequent: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: { name: 'print' },
                  arguments: []
                }
              }
            ]
          }
        ]
      },
      // Stop statement
      {
        type: 'StopStatement'
      }
    ]
  }
};

// Test the conversion
console.log('Fortran Example Code:');
console.log(getFortranExampleCode());
console.log('\nExpected Mermaid Output:');
console.log(getExpectedMermaidOutput());

// Map the program and generate Mermaid code
const mappedProgram = mapFortranProgram(mockAST);
console.log('\nGenerated Mermaid Output:');
console.log(mappedProgram.mermaid);

console.log('\nConversion completed successfully!');