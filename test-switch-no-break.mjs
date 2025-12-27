#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Read a Java file with switch statement without break in default case
const javaCode = readFileSync('./test-switch-no-break.java', 'utf8');

console.log('Testing switch statement without break in default:');
console.log('===============================================');
const result = generateFlowchart(javaCode);
console.log(result);