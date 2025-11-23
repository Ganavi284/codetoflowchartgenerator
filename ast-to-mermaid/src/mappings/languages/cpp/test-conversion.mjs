/**
 * Test file to demonstrate C++ to Mermaid conversion
 */

import { mapCppProgram } from './cpp.mjs';
import { getCppExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our C++ example
const mockAST = {
  type: 'Program',
  body: [
    {
      type: 'FunctionDeclaration',
      id: { name: 'main' },
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
          // For loop
          {
            type: 'ForStatement',
            init: {
              type: 'AssignmentExpression',
              left: { name: 'i' },
              right: { type: 'Literal', value: 0 }
            },
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { name: 'i' },
              right: { type: 'Literal', value: 5 }
            },
            update: {
              type: 'UpdateExpression',
              operator: '++',
              argument: { name: 'i' }
            },
            body: {
              type: 'BlockStatement',
              body: [
                // sum += i;
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '+=',
                    left: { name: 'sum' },
                    right: { name: 'i' }
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
                          callee: { name: 'printf' },
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
                          callee: { name: 'printf' },
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
            type: 'WhileStatement',
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
                    callee: { name: 'printf' },
                    arguments: []
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: { name: 'j' }
                  }
                }
              ]
            }
          },
          // Do-while loop
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
            type: 'DoWhileStatement',
            body: {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'CallExpression',
                    callee: { name: 'printf' },
                    arguments: []
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'UpdateExpression',
                    operator: '++',
                    argument: { name: 'k' }
                  }
                }
              ]
            },
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { name: 'k' },
              right: { type: 'Literal', value: 2 }
            }
          },
          // Switch statement
          {
            type: 'SwitchStatement',
            discriminant: { name: 'sum' },
            cases: [
              {
                test: { type: 'Literal', value: 0 },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: { name: 'printf' },
                      arguments: []
                    }
                  },
                  {
                    type: 'BreakStatement'
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
                      callee: { name: 'printf' },
                      arguments: []
                    }
                  },
                  {
                    type: 'BreakStatement'
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
                      callee: { name: 'printf' },
                      arguments: []
                    }
                  },
                  {
                    type: 'BreakStatement'
                  }
                ]
              }
            ]
          },
          // Return statement
          {
            type: 'ReturnStatement',
            argument: { type: 'Literal', value: 0 }
          }
        ]
      }
    }
  ]
};

// Test the conversion
console.log('C++ Example Code:');
console.log(getCppExampleCode());
console.log('\nExpected Mermaid Output:');
console.log(getExpectedMermaidOutput());

// Map the program and generate Mermaid code
const mappedProgram = mapCppProgram(mockAST);
console.log('\nGenerated Mermaid Output:');
console.log(mappedProgram.mermaid);

console.log('\nConversion completed successfully!');