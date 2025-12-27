#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read the Pascal example with statements after case
const pascalCode = readFileSync('./test-pascal-case-with-next.pas', 'utf8');

console.log('Testing Pascal case statement with next nodes:');
console.log('============================================');
const result = generateFlowchart(pascalCode);
console.log(result);