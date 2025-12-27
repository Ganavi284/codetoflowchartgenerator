#!/usr/bin/env node

import { readFileSync } from 'fs';
import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// Read a Java file with switch statement
const javaCode = readFileSync('./ast-to-mermaid/TestSwitch.java', 'utf8');

console.log('Testing switch statement:');
console.log('=========================');
const result = generateFlowchart(javaCode);
console.log(result);