#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the Pascal example with nested if in case
const pascalCode = readFileSync('./test-pascal-nested-if-case.pas', 'utf8');

console.log('Testing Pascal case with nested if statement:');
console.log('=============================================');
const result = generateFlowchart(pascalCode);
console.log(result);