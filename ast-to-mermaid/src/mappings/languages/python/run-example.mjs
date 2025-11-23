#!/usr/bin/env node

/**
 * Run the Python to Mermaid conversion example
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
          targets: [{ type: 'Name', id: 'i' }],
          value: { type: 'Constant', value: 0, kind: null }
        },
        {
          type: 'Assign',
          targets: [{ type: 'Name', id: 'sum' }],
          value: { type: 'Constant', value: 0, kind: null }
        },
        // For loop
        {
          type: 'For',
          target: { type: 'Name', id: 'i' },
          iter: {
            type: 'Call',
            func: { type: 'Name', id: 'range' },
            args: [{ type: 'Constant', value: 5, kind: null }],
            keywords: []
          },
          body: [
            // sum += i
            {
              type: 'AugAssign',
              target: { type: 'Name', id: 'sum' },
              op: { type: 'Add' },
              value: { type: 'Name', id: 'i' }
            },
            // Nested if statement
            {
              type: 'If',
              test: {
                type: 'Compare',
                left: { type: 'Name', id: 'i' },
                ops: [{ type: 'Gt' }],
                comparators: [{ type: 'Constant', value: 2, kind: null }]
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { type: 'Name', id: 'print' },
                      attr: 'print',
                      ctx: { type: 'Load' }
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'i is greater than 2: ', kind: null },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { type: 'Name', id: 'str' },
                          args: [{ type: 'Name', id: 'i' }],
                          keywords: []
                        }
                      }
                    ],
                    keywords: []
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
                      value: { type: 'Name', id: 'print' },
                      attr: 'print',
                      ctx: { type: 'Load' }
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'i is less than or equal to 2: ', kind: null },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { type: 'Name', id: 'str' },
                          args: [{ type: 'Name', id: 'i' }],
                          keywords: []
                        }
                      }
                    ],
                    keywords: []
                  }
                }
              ]
            }
          ],
          orelse: [],
          lineno: 7,
          col_offset: 4
        },
        // While loop
        {
          type: 'Assign',
          targets: [{ type: 'Name', id: 'j' }],
          value: { type: 'Constant', value: 0, kind: null }
        },
        {
          type: 'While',
          test: {
            type: 'Compare',
            left: { type: 'Name', id: 'j' },
            ops: [{ type: 'Lt' }],
            comparators: [{ type: 'Constant', value: 3, kind: null }]
          },
          body: [
            {
              type: 'Expr',
              value: {
                type: 'Call',
                func: {
                  type: 'Attribute',
                  value: { type: 'Name', id: 'print' },
                  attr: 'print',
                  ctx: { type: 'Load' }
                },
                args: [
                  {
                    type: 'BinOp',
                    left: { type: 'Constant', value: 'While loop iteration: ', kind: null },
                    op: { type: 'Add' },
                    right: {
                      type: 'Call',
                      func: { type: 'Name', id: 'str' },
                      args: [{ type: 'Name', id: 'j' }],
                      keywords: []
                    }
                  }
                ],
                keywords: []
              }
            },
            {
              type: 'AugAssign',
              target: { type: 'Name', id: 'j' },
              op: { type: 'Add' },
              value: { type: 'Constant', value: 1, kind: null }
            }
          ],
          orelse: [],
          lineno: 15,
          col_offset: 4
        },
        // Do-while loop simulation
        {
          type: 'Assign',
          targets: [{ type: 'Name', id: 'k' }],
          value: { type: 'Constant', value: 0, kind: null }
        },
        {
          type: 'While',
          test: { type: 'Constant', value: true, kind: null },
          body: [
            {
              type: 'Expr',
              value: {
                type: 'Call',
                func: {
                  type: 'Attribute',
                  value: { type: 'Name', id: 'print' },
                  attr: 'print',
                  ctx: { type: 'Load' }
                },
                args: [
                  {
                    type: 'BinOp',
                    left: { type: 'Constant', value: 'Do-while loop iteration: ', kind: null },
                    op: { type: 'Add' },
                    right: {
                      type: 'Call',
                      func: { type: 'Name', id: 'str' },
                      args: [{ type: 'Name', id: 'k' }],
                      keywords: []
                    }
                  }
                ],
                keywords: []
              }
            },
            {
              type: 'AugAssign',
              target: { type: 'Name', id: 'k' },
              op: { type: 'Add' },
              value: { type: 'Constant', value: 1, kind: null }
            },
            // Break condition
            {
              type: 'If',
              test: {
                type: 'UnaryOp',
                op: { type: 'Not' },
                operand: {
                  type: 'Compare',
                  left: { type: 'Name', id: 'k' },
                  ops: [{ type: 'Lt' }],
                  comparators: [{ type: 'Constant', value: 2, kind: null }]
                }
              },
              body: [
                { type: 'Break' }
              ],
              orelse: []
            }
          ],
          orelse: [],
          lineno: 21,
          col_offset: 4
        },
        // Match statement
        {
          type: 'Match',
          subject: { type: 'Name', id: 'sum' },
          cases: [
            {
              type: 'match_case',
              pattern: {
                type: 'MatchValue',
                value: { type: 'Constant', value: 0, kind: null }
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { type: 'Name', id: 'print' },
                      attr: 'print',
                      ctx: { type: 'Load' }
                    },
                    args: [
                      { type: 'Constant', value: 'Sum is zero', kind: null }
                    ],
                    keywords: []
                  }
                }
              ]
            },
            {
              type: 'match_case',
              pattern: {
                type: 'MatchValue',
                value: { type: 'Constant', value: 10, kind: null }
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { type: 'Name', id: 'print' },
                      attr: 'print',
                      ctx: { type: 'Load' }
                    },
                    args: [
                      { type: 'Constant', value: 'Sum is ten', kind: null }
                    ],
                    keywords: []
                  }
                }
              ]
            },
            {
              type: 'match_case',
              pattern: { 
                type: 'MatchAs',
                name: null
              },
              body: [
                {
                  type: 'Expr',
                  value: {
                    type: 'Call',
                    func: {
                      type: 'Attribute',
                      value: { type: 'Name', id: 'print' },
                      attr: 'print',
                      ctx: { type: 'Load' }
                    },
                    args: [
                      {
                        type: 'BinOp',
                        left: { type: 'Constant', value: 'Sum is something else: ', kind: null },
                        op: { type: 'Add' },
                        right: {
                          type: 'Call',
                          func: { type: 'Name', id: 'str' },
                          args: [{ type: 'Name', id: 'sum' }],
                          keywords: []
                        }
                      }
                    ],
                    keywords: []
                  }
                }
              ]
            }
          ],
          lineno: 30,
          col_offset: 4
        }
      ],
      decorator_list: [],
      returns: null,
      lineno: 2,
      col_offset: 0
    },
    // Function call: main()
    {
      type: 'Expr',
      value: {
        type: 'Call',
        func: { type: 'Name', id: 'main' },
        args: [],
        keywords: []
      },
      lineno: 47,
      col_offset: 0
    }
  ],
  type_ignores: []
};

console.log('Python to Mermaid Conversion Example');
console.log('=====================================');

// Map the Python program
const mappedProgram = mapPythonProgram(mockAST);

console.log('Generated Mermaid Code:');
console.log('----------------------');
console.log(mappedProgram.mermaid);

console.log('\nExpected Mermaid Code:');
console.log('---------------------');
console.log(getExpectedMermaidOutput());