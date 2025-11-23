/**
 * Test file to demonstrate Python to Mermaid conversion
 */

import { mapPythonProgram } from './python.mjs';
import { getPythonExampleCode, getExpectedMermaidOutput } from './example-conversion.mjs';

// Mock AST for our Python example
const mockAST = {
  type: 'Module',
  body: [
    {
      type: 'FunctionDef',
      name: 'main',
      args: {
        posonlyargs: [],
        args: [],
        vararg: null,
        kwonlyargs: [],
        kw_defaults: [],
        kwarg: null,
        defaults: []
      },
      body: [
        // Variable assignments: i = 0, sum = 0
        {
          type: 'Assign',
          targets: [{ id: 'i' }],
          value: { type: 'Constant', value: 0 }
        },
        {
          type: 'Assign',
          targets: [{ id: 'sum' }],
          value: { type: 'Constant', value: 0 }
        },
        // For loop
        {
          type: 'For',
          target: { id: 'i' },
          iter: {
            type: 'Call',
            func: { id: 'range' },
            args: [{ type: 'Constant', value: 5 }]
          },
          body: [
            // sum += i
            {
              type: 'AugAssign',
              target: { id: 'sum' },
              op: { type: 'Add' },
              value: { id: 'i' }
            },
            // Nested if statement
            {
              type: 'If',
              test: {
                type: 'Compare',
                left: { id: 'i' },
                ops: [{ type: 'Gt' }],
                comparators: [{ type: 'Constant', value: 2 }]
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { id: 'print' },
                      attr: 'print'
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'i is greater than 2: ' },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { id: 'str' },
                          args: [{ id: 'i' }]
                        }
                      }
                    ]
                  }
                }
              ],
              orelse: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { id: 'print' },
                      attr: 'print'
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'i is less than or equal to 2: ' },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { id: 'str' },
                          args: [{ id: 'i' }]
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ],
          orelse: []
        },
        // While loop
        {
          type: 'Assign',
          targets: [{ id: 'j' }],
          value: { type: 'Constant', value: 0 }
        },
        {
          type: 'While',
          test: {
            type: 'Compare',
            left: { id: 'j' },
            ops: [{ type: 'Lt' }],
            comparators: [{ type: 'Constant', value: 3 }]
          },
          body: [
            {
              type: 'Expr',
              value: {
                type: 'Call',
                func: {
                  type: 'Attribute',
                  value: { id: 'print' },
                  attr: 'print'
                },
                args: [
                  {
                    type: 'BinOp',
                    left: { type: 'Constant', value: 'While loop iteration: ' },
                    op: { type: 'Add' },
                    right: {
                      type: 'Call',
                      func: { id: 'str' },
                      args: [{ id: 'j' }]
                    }
                  }
                ]
              }
            },
            {
              type: 'AugAssign',
              target: { id: 'j' },
              op: { type: 'Add' },
              value: { type: 'Constant', value: 1 }
            }
          ],
          orelse: []
        },
        // Do-while loop simulation
        {
          type: 'Assign',
          targets: [{ id: 'k' }],
          value: { type: 'Constant', value: 0 }
        },
        {
          type: 'While',
          test: { type: 'Constant', value: true },
          body: [
            {
              type: 'Expr',
              value: {
                type: 'Call',
                func: {
                  type: 'Attribute',
                  value: { id: 'print' },
                  attr: 'print'
                },
                args: [
                  {
                    type: 'BinOp',
                    left: { type: 'Constant', value: 'Do-while loop iteration: ' },
                    op: { type: 'Add' },
                    right: {
                      type: 'Call',
                      func: { id: 'str' },
                      args: [{ id: 'k' }]
                    }
                  }
                ]
              }
            },
            {
              type: 'AugAssign',
              target: { id: 'k' },
              op: { type: 'Add' },
              value: { type: 'Constant', value: 1 }
            },
            // Break condition
            {
              type: 'If',
              test: {
                type: 'UnaryOp',
                op: { type: 'Not' },
                operand: {
                  type: 'Compare',
                  left: { id: 'k' },
                  ops: [{ type: 'Lt' }],
                  comparators: [{ type: 'Constant', value: 2 }]
                }
              },
              body: [
                { type: 'Break' }
              ],
              orelse: []
            }
          ],
          orelse: []
        },
        // Match statement
        {
          type: 'Match',
          subject: { id: 'sum' },
          cases: [
            {
              type: 'match_case',
              pattern: {
                type: 'MatchValue',
                value: { type: 'Constant', value: 0 }
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { id: 'print' },
                      attr: 'print'
                    },
                    args: [
                      { type: 'Constant', value: 'Sum is zero' }
                    ]
                  }
                },
                { type: 'Break' }
              ]
            },
            {
              type: 'match_case',
              pattern: {
                type: 'MatchValue',
                value: { type: 'Constant', value: 10 }
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { id: 'print' },
                      attr: 'print'
                    },
                    args: [
                      { type: 'Constant', value: 'Sum is ten' }
                    ]
                  }
                },
                { type: 'Break' }
              ]
            },
            {
              type: 'match_case',
              pattern: { type: 'MatchAs' },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { id: 'print' },
                      attr: 'print'
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'Sum is something else: ' },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { id: 'str' },
                          args: [{ id: 'sum' }]
                        }
                      }
                    ]
                  }
                },
                { type: 'Break' }
              ]
            }
          ]
        }
      ]
    },
    // Function call: main()
    {
      type: 'Expr',
      value: {
        type: 'Call',
        func: { id: 'main' },
        args: []
      }
    }
  ]
};

console.log('Python to Mermaid Conversion Test');
console.log('=================================');

// Map the Python program
const mappedProgram = mapPythonProgram(mockAST);

console.log('Mapped Program Nodes:');
console.log('--------------------');
console.log(JSON.stringify(mappedProgram.nodes, null, 2));

console.log('\nGenerated Mermaid Code:');
console.log('----------------------');
console.log(mappedProgram.mermaid);