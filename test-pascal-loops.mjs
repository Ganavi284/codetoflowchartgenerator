#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the Pascal example with loops
const pascalCode = readFileSync('./test-pascal-loops.pas', 'utf8');

console.log('Testing Pascal loops:');
console.log('=====================');
const result = generateFlowchart(pascalCode);
console.log(result);