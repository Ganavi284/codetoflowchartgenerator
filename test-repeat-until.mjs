#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the Pascal example with repeat-until loop
const pascalCode = readFileSync('./test-repeat-until.pas', 'utf8');

console.log('Testing Pascal repeat-until loop:');
console.log('================================');
const result = generateFlowchart(pascalCode);
console.log(result);