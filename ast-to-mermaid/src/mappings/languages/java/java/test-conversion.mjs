/**
 * Test file to demonstrate Java to Mermaid conversion
 */

import { mapJavaProgram } from './java.mjs';
import { getJavaExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our Java example
const mockAST = {
  type: 'Program',
  body: [
    {
      type: 'ClassDeclaration',
      id: { name: 'Main' },
      body: {
        type: 'ClassBody',
        body: [
          {
            type: 'MethodDeclaration',
            name: 'main',
            params: [
              {
                type: 'Parameter',
                name: 'args',
                typeAnnotation: 'String[]'
              }
            ],
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
                                callee: {
                                  object: { name: 'System' },
                                  property: { name: 'out' }
                                },
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
                                callee: {
                                  object: { name: 'System' },
                                  property: { name: 'out' }
                                },
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
                          callee: {
                            object: { name: 'System' },
                            property: { name: 'out' }
                          },
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
                          callee: {
                            object: { name: 'System' },
                            property: { name: 'out' }
                          },
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
                            callee: {
                              object: { name: 'System' },
                              property: { name: 'out' }
                            },
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
                            callee: {
                              object: { name: 'System' },
                              property: { name: 'out' }
                            },
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
                            callee: {
                              object: { name: 'System' },
                              property: { name: 'out' }
                            },
                            arguments: []
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
          }
        ]
      }
    }
  ]
};

// Test the conversion
console.log('Java Example Code:');
console.log(getJavaExampleCode());
console.log('\nExpected Mermaid Output:');
console.log(getExpectedMermaidOutput());

// Map the program and generate Mermaid code
const mappedProgram = mapJavaProgram(mockAST);
console.log('\nGenerated Mermaid Output:');
console.log(mappedProgram.mermaid);

console.log('\nConversion completed successfully!');