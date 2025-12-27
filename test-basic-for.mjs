#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the Pascal example with basic for loop
const pascalCode = readFileSync('./test-basic-for.pas', 'utf8');

console.log('Testing Pascal basic for loop:');
console.log('=============================');
const result = generateFlowchart(pascalCode);
console.log(result);