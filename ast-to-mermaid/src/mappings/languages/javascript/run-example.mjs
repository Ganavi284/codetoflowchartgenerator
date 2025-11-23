#!/usr/bin/env node

/**
 * Run the JavaScript to Mermaid conversion example
 */

import { mapJavaScriptProgram } from './javascript.mjs';
import { getJavaScriptExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our JavaScript example
const mockAST = {
  type: 'Program',
  body: [
    {
      type: 'FunctionDeclaration',
      id: { name: 'main' },
      params: [],
      body: {
        type: 'BlockStatement',
        body: [
          // Variable declarations: let i, sum = 0;
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: { name: 'i' },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: { name: 'sum' },
                init: { type: 'Literal', value: 0, raw: '0' }
              }
            ]
          },
          // For loop
          {
            type: 'ForStatement',
            init: {
              type: 'AssignmentExpression',
              operator: '=',
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
              argument: { name: 'i' },
              prefix: false
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
                // Nested if statement
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
                          callee: {
                            type: 'MemberExpression',
                            object: { name: 'console' },
                            property: { name: 'log' }
                          },
                          arguments: [
                            {
                              type: 'BinaryExpression',
                              operator: '+',
                              left: { type: 'Literal', value: 'i is greater than 2: ' },
                              right: { name: 'i' }
                            }
                          ]
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
                          callee: {
                            type: 'MemberExpression',
                            object: { name: 'console' },
                            property: { name: 'log' }
                          },
                          arguments: [
                            {
                              type: 'BinaryExpression',
                              operator: '+',
                              left: { type: 'Literal', value: 'i is less than or equal to 2: ' },
                              right: { name: 'i' }
                            }
                          ]
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
            kind: 'let',
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
                    callee: {
                      type: 'MemberExpression',
                      object: { name: 'console' },
                      property: { name: 'log' }
                    },
                    arguments: [
                      {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: { type: 'Literal', value: 'While loop iteration: ' },
                        right: { name: 'j' }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '++',
                    left: { name: 'j' },
                    right: { name: 'j' }
                  }
                }
              ]
            }
          },
          // Do-while loop
          {
            type: 'VariableDeclaration',
            kind: 'let',
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
                    callee: {
                      type: 'MemberExpression',
                      object: { name: 'console' },
                      property: { name: 'log' }
                    },
                    arguments: [
                      {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: { type: 'Literal', value: 'Do-while loop iteration: ' },
                        right: { name: 'k' }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '++',
                    left: { name: 'k' },
                    right: { name: 'k' }
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
                type: 'SwitchCase',
                test: { type: 'Literal', value: 0 },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: { name: 'console' },
                        property: { name: 'log' }
                      },
                      arguments: [
                        { type: 'Literal', value: 'Sum is zero' }
                      ]
                    }
                  },
                  {
                    type: 'BreakStatement'
                  }
                ]
              },
              {
                type: 'SwitchCase',
                test: { type: 'Literal', value: 10 },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: { name: 'console' },
                        property: { name: 'log' }
                      },
                      arguments: [
                        { type: 'Literal', value: 'Sum is ten' }
                      ]
                    }
                  },
                  {
                    type: 'BreakStatement'
                  }
                ]
              },
              {
                type: 'SwitchCase',
                test: null,
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: { name: 'console' },
                        property: { name: 'log' }
                      },
                      arguments: [
                        {
                          type: 'BinaryExpression',
                          operator: '+',
                          left: { type: 'Literal', value: 'Sum is something else: ' },
                          right: { name: 'sum' }
                        }
                      ]
                    }
                  },
                  {
                    type: 'BreakStatement'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    // Function call: main();
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: { name: 'main' },
        arguments: []
      }
    }
  ]
};

console.log('JavaScript to Mermaid Conversion Example');
console.log('=====================================');

// Map the JavaScript program
const mappedProgram = mapJavaScriptProgram(mockAST);

console.log('Generated Mermaid Code:');
console.log('----------------------');
console.log(mappedProgram.mermaid);

console.log('\nExpected Mermaid Code:');
console.log('---------------------');
console.log(getExpectedMermaidOutput());