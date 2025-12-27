#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/pascal/pipeline/flow.mjs';

// Read a more complex Pascal file to test connectivity
const pascalCode = readFileSync('./ast-to-mermaid/if-else-if-test.pas', 'utf8');

console.log('Testing Pascal connectivity with if-else-if:');
console.log('===========================================');
const result = generateFlowchart(pascalCode);
console.log(result);