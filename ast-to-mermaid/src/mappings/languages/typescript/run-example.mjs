#!/usr/bin/env node

/**
 * Run the TypeScript to Mermaid conversion example
 */

import { mapTypeScriptProgram } from './typescript.mjs';
import { getTypeScriptExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our TypeScript example
const mockAST = {
  type: 'Program',
  body: [
    {
      type: 'FunctionDeclaration',
      id: { name: 'main' },
      params: [],
      returnType: { type: 'TSVoidKeyword' },
      body: {
        type: 'BlockStatement',
        body: [
          // Variable declarations: let i: number, sum: number = 0;
          {
            type: 'VariableDeclaration',
            kind: 'let',
            declarations: [
              {
                type: 'VariableDeclarator',
                id: { 
                  type: 'Identifier',
                  name: 'i',
                  typeAnnotation: {
                    type: 'TSTypeAnnotation',
                    typeAnnotation: { type: 'TSNumberKeyword' }
                  }
                },
                init: null
              },
              {
                type: 'VariableDeclarator',
                id: { 
                  type: 'Identifier',
                  name: 'sum',
                  typeAnnotation: {
                    type: 'TSTypeAnnotation',
                    typeAnnotation: { type: 'TSNumberKeyword' }
                  }
                },
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
              left: { type: 'Identifier', name: 'i' },
              right: { type: 'Literal', value: 0, raw: '0' }
            },
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { type: 'Identifier', name: 'i' },
              right: { type: 'Literal', value: 5, raw: '5' }
            },
            update: {
              type: 'UpdateExpression',
              operator: '++',
              argument: { type: 'Identifier', name: 'i' },
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
                    left: { type: 'Identifier', name: 'sum' },
                    right: { type: 'Identifier', name: 'i' }
                  }
                },
                // Nested if statement
                {
                  type: 'IfStatement',
                  test: {
                    type: 'BinaryExpression',
                    operator: '>',
                    left: { type: 'Identifier', name: 'i' },
                    right: { type: 'Literal', value: 2, raw: '2' }
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
                            object: { type: 'Identifier', name: 'console' },
                            property: { type: 'Identifier', name: 'log' },
                            computed: false
                          },
                          arguments: [
                            {
                              type: 'BinaryExpression',
                              operator: '+',
                              left: { type: 'Literal', value: 'i is greater than 2: ', raw: '"i is greater than 2: "' },
                              right: { type: 'Identifier', name: 'i' }
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
                            object: { type: 'Identifier', name: 'console' },
                            property: { type: 'Identifier', name: 'log' },
                            computed: false
                          },
                          arguments: [
                            {
                              type: 'BinaryExpression',
                              operator: '+',
                              left: { type: 'Literal', value: 'i is less than or equal to 2: ', raw: '"i is less than or equal to 2: "' },
                              right: { type: 'Identifier', name: 'i' }
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
                id: { 
                  type: 'Identifier',
                  name: 'j',
                  typeAnnotation: {
                    type: 'TSTypeAnnotation',
                    typeAnnotation: { type: 'TSNumberKeyword' }
                  }
                },
                init: { type: 'Literal', value: 0, raw: '0' }
              }
            ]
          },
          {
            type: 'WhileStatement',
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { type: 'Identifier', name: 'j' },
              right: { type: 'Literal', value: 3, raw: '3' }
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
                      object: { type: 'Identifier', name: 'console' },
                      property: { type: 'Identifier', name: 'log' },
                      computed: false
                    },
                    arguments: [
                      {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: { type: 'Literal', value: 'While loop iteration: ', raw: '"While loop iteration: "' },
                        right: { type: 'Identifier', name: 'j' }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '++',
                    left: { type: 'Identifier', name: 'j' },
                    right: { type: 'Identifier', name: 'j' }
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
                id: { 
                  type: 'Identifier',
                  name: 'k',
                  typeAnnotation: {
                    type: 'TSTypeAnnotation',
                    typeAnnotation: { type: 'TSNumberKeyword' }
                  }
                },
                init: { type: 'Literal', value: 0, raw: '0' }
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
                      object: { type: 'Identifier', name: 'console' },
                      property: { type: 'Identifier', name: 'log' },
                      computed: false
                    },
                    arguments: [
                      {
                        type: 'BinaryExpression',
                        operator: '+',
                        left: { type: 'Literal', value: 'Do-while loop iteration: ', raw: '"Do-while loop iteration: "' },
                        right: { type: 'Identifier', name: 'k' }
                      }
                    ]
                  }
                },
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'AssignmentExpression',
                    operator: '++',
                    left: { type: 'Identifier', name: 'k' },
                    right: { type: 'Identifier', name: 'k' }
                  }
                }
              ]
            },
            test: {
              type: 'BinaryExpression',
              operator: '<',
              left: { type: 'Identifier', name: 'k' },
              right: { type: 'Literal', value: 2, raw: '2' }
            }
          },
          // Switch statement
          {
            type: 'SwitchStatement',
            discriminant: { type: 'Identifier', name: 'sum' },
            cases: [
              {
                type: 'SwitchCase',
                test: { type: 'Literal', value: 0, raw: '0' },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: { type: 'Identifier', name: 'console' },
                        property: { type: 'Identifier', name: 'log' },
                        computed: false
                      },
                      arguments: [
                        { type: 'Literal', value: 'Sum is zero', raw: '"Sum is zero"' }
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
                test: { type: 'Literal', value: 10, raw: '10' },
                consequent: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: {
                        type: 'MemberExpression',
                        object: { type: 'Identifier', name: 'console' },
                        property: { type: 'Identifier', name: 'log' },
                        computed: false
                      },
                      arguments: [
                        { type: 'Literal', value: 'Sum is ten', raw: '"Sum is ten"' }
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
                        object: { type: 'Identifier', name: 'console' },
                        property: { type: 'Identifier', name: 'log' },
                        computed: false
                      },
                      arguments: [
                        {
                          type: 'BinaryExpression',
                          operator: '+',
                          left: { type: 'Literal', value: 'Sum is something else: ', raw: '"Sum is something else: "' },
                          right: { type: 'Identifier', name: 'sum' }
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
        callee: { type: 'Identifier', name: 'main' },
        arguments: []
      }
    }
  ]
};

console.log('TypeScript to Mermaid Conversion Example');
console.log('========================================');

// Map the TypeScript program
const mappedProgram = mapTypeScriptProgram(mockAST);

console.log('Generated Mermaid Code:');
console.log('----------------------');
console.log(mappedProgram.mermaid);

console.log('\nExpected Mermaid Code:');
console.log('---------------------');
console.log(getExpectedMermaidOutput());