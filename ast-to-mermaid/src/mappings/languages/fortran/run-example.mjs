#!/usr/bin/env node

/**
 * Run the Fortran to Mermaid conversion example
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
      // Program block
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'Identifier',
          name: 'implicit none'
        }
      },
      // Variable declarations: integer :: i, sum = 0;
      {
        type: 'VariableDeclaration',
        kind: 'integer',
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
      // Do loop (Fortran's for loop)
      {
        type: 'DoLoop',
        variable: { name: 'i' },
        start: { type: 'Literal', value: 0, raw: '0' },
        end: { type: 'Literal', value: 4, raw: '4' },
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
                right: { type: 'Literal', value: 2, raw: '2' }
              },
              consequent: {
                type: 'BlockStatement',
                body: [
                  {
                    type: 'ExpressionStatement',
                    expression: {
                      type: 'CallExpression',
                      callee: { name: 'print' },
                      arguments: [
                        { type: 'Literal', value: '*', raw: '*' },
                        { type: 'Literal', value: 'i is greater than 2: ', raw: '"i is greater than 2: "' },
                        { name: 'i' }
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
                      callee: { name: 'print' },
                      arguments: [
                        { type: 'Literal', value: '*', raw: '*' },
                        { type: 'Literal', value: 'i is less than or equal to 2: ', raw: '"i is less than or equal to 2: "' },
                        { name: 'i' }
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
        kind: 'integer',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { name: 'j' },
            init: { type: 'Literal', value: 0, raw: '0' }
          }
        ]
      },
      {
        type: 'DoWhileLoop',
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
                callee: { name: 'print' },
                arguments: [
                  { type: 'Literal', value: '*', raw: '*' },
                  { type: 'Literal', value: 'While loop iteration: ', raw: '"While loop iteration: "' },
                  { name: 'j' }
                ]
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
                  right: { type: 'Literal', value: 1, raw: '1' }
                }
              }
            }
          ]
        }
      },
      // Do loop with exit (Fortran's do-while)
      {
        type: 'VariableDeclaration',
        kind: 'integer',
        declarations: [
          {
            type: 'VariableDeclarator',
            id: { name: 'k' },
            init: { type: 'Literal', value: 0, raw: '0' }
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
                arguments: [
                  { type: 'Literal', value: '*', raw: '*' },
                  { type: 'Literal', value: 'Do-while loop iteration: ', raw: '"Do-while loop iteration: "' },
                  { name: 'k' }
                ]
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
                  right: { type: 'Literal', value: 1, raw: '1' }
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
                right: { type: 'Literal', value: 2, raw: '2' }
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
            type: 'SwitchCase',
            test: { type: 'Literal', value: 0, raw: '0' },
            consequent: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: { name: 'print' },
                  arguments: [
                    { type: 'Literal', value: '*', raw: '*' },
                    { type: 'Literal', value: 'Sum is zero', raw: '"Sum is zero"' }
                  ]
                }
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
                  callee: { name: 'print' },
                  arguments: [
                    { type: 'Literal', value: '*', raw: '*' },
                    { type: 'Literal', value: 'Sum is ten', raw: '"Sum is ten"' }
                  ]
                }
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
                  callee: { name: 'print' },
                  arguments: [
                    { type: 'Literal', value: '*', raw: '*' },
                    { type: 'Literal', value: 'Sum is something else: ', raw: '"Sum is something else: "' },
                    { name: 'sum' }
                  ]
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

console.log('='.repeat(60));
console.log('Fortran to Mermaid Conversion Example');
console.log('='.repeat(60));

console.log('\n1. Fortran Example Code:');
console.log('-'.repeat(30));
console.log(getFortranExampleCode());

console.log('\n2. Expected Mermaid Output:');
console.log('-'.repeat(30));
console.log(getExpectedMermaidOutput());

// Map the program and generate Mermaid code
console.log('\n3. Generated Mermaid Output:');
console.log('-'.repeat(30));
const mappedProgram = mapFortranProgram(mockAST);
console.log(mappedProgram.mermaid);

console.log('\n4. Conversion Summary:');
console.log('-'.repeat(30));
console.log(`✓ Mapped program with ${mappedProgram.nodes ? mappedProgram.nodes.length : 0} AST nodes`);
console.log(`✓ Generated Mermaid diagram with ${mappedProgram.mermaid.split('\n').length} lines`);
console.log('✓ Conversion completed successfully!');

console.log('\n' + '='.repeat(60));
console.log('End of Example');
console.log('='.repeat(60));