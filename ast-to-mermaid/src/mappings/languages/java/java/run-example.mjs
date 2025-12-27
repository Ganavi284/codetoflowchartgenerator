#!/usr/bin/env node

/**
 * Run the Java to Mermaid conversion example
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
                // Variable declarations: int i, sum = 0;
                {
                  type: 'VariableDeclaration',
                  kind: 'int',
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
                    right: { type: 'Literal', value: 0, raw: '0' }
                  },
                  test: {
                    type: 'BinaryExpression',
                    operator: '<',
                    left: { name: 'i' },
                    right: { type: 'Literal', value: 5, raw: '5' }
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
                                  object: { name: 'System' },
                                  property: { name: 'out' }
                                },
                                arguments: [
                                  { type: 'BinaryExpression', operator: '+', 
                                    left: { type: 'Literal', value: 'i is greater than 2: ', raw: '"i is greater than 2: "' },
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
                                  object: { name: 'System' },
                                  property: { name: 'out' }
                                },
                                arguments: [
                                  { type: 'BinaryExpression', operator: '+', 
                                    left: { type: 'Literal', value: 'i is less than or equal to 2: ', raw: '"i is less than or equal to 2: "' },
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
                  kind: 'int',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: { name: 'j' },
                      init: { type: 'Literal', value: 0, raw: '0' }
                    }
                  ]
                },
                {
                  type: 'WhileStatement',
                  test: {
                    type: 'BinaryExpression',
                    operator: '<',
                    left: { name: 'j' },
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
                            object: { name: 'System' },
                            property: { name: 'out' }
                          },
                          arguments: [
                            { type: 'BinaryExpression', operator: '+', 
                              left: { type: 'Literal', value: 'While loop iteration: ', raw: '"While loop iteration: "' },
                              right: { name: 'j' }
                            }
                          ]
                        }
                      },
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'UpdateExpression',
                          operator: '++',
                          argument: { name: 'j' },
                          prefix: false
                        }
                      }
                    ]
                  }
                },
                // Do-while loop
                {
                  type: 'VariableDeclaration',
                  kind: 'int',
                  declarations: [
                    {
                      type: 'VariableDeclarator',
                      id: { name: 'k' },
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
                            object: { name: 'System' },
                            property: { name: 'out' }
                          },
                          arguments: [
                            { type: 'BinaryExpression', operator: '+', 
                              left: { type: 'Literal', value: 'Do-while loop iteration: ', raw: '"Do-while loop iteration: "' },
                              right: { name: 'k' }
                            }
                          ]
                        }
                      },
                      {
                        type: 'ExpressionStatement',
                        expression: {
                          type: 'UpdateExpression',
                          operator: '++',
                          argument: { name: 'k' },
                          prefix: false
                        }
                      }
                    ]
                  },
                  test: {
                    type: 'BinaryExpression',
                    operator: '<',
                    left: { name: 'k' },
                    right: { type: 'Literal', value: 2, raw: '2' }
                  }
                },
                // Switch statement
                {
                  type: 'SwitchStatement',
                  discriminant: { name: 'sum' },
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
                              object: { name: 'System' },
                              property: { name: 'out' }
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
                              object: { name: 'System' },
                              property: { name: 'out' }
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
                              object: { name: 'System' },
                              property: { name: 'out' }
                            },
                            arguments: [
                              { type: 'BinaryExpression', operator: '+', 
                                left: { type: 'Literal', value: 'Sum is something else: ', raw: '"Sum is something else: "' },
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
          }
        ]
      }
    }
  ]
};

console.log('='.repeat(60));
console.log('Java to Mermaid Conversion Example');
console.log('='.repeat(60));

console.log('\n1. Java Example Code:');
console.log('-'.repeat(30));
console.log(getJavaExampleCode());

console.log('\n2. Expected Mermaid Output:');
console.log('-'.repeat(30));
console.log(getExpectedMermaidOutput());

// Map the program and generate Mermaid code
console.log('\n3. Generated Mermaid Output:');
console.log('-'.repeat(30));
const mappedProgram = mapJavaProgram(mockAST);
console.log(mappedProgram.mermaid);

console.log('\n4. Conversion Summary:');
console.log('-'.repeat(30));
console.log(`✓ Mapped ${mappedProgram.nodes.length} AST nodes`);
console.log(`✓ Generated Mermaid diagram with ${mappedProgram.mermaid.split('\n').length} lines`);
console.log('✓ Conversion completed successfully!');

console.log('\n' + '='.repeat(60));
console.log('End of Example');
console.log('='.repeat(60));