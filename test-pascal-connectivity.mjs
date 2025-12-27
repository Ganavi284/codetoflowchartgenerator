#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read a Pascal file to test connectivity
const pascalCode = readFileSync('./ast-to-mermaid/simple-if-else.pas', 'utf8');

console.log('Testing Pascal connectivity with if-else:');
console.log('========================================');
const result = generateFlowchart(pascalCode);
console.log(result);