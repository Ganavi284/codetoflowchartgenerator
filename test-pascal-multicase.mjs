#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the multi-case Pascal example
const pascalCode = readFileSync('./test-pascal-multicase.pas', 'utf8');

console.log('Testing Pascal multi-case statement:');
console.log('====================================');
const result = generateFlowchart(pascalCode);
console.log(result);