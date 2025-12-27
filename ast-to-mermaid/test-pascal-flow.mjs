import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/pascal/pipeline/flow.mjs';

const source = readFileSync('../test-day-of-week.pas', 'utf8');
console.log(generateFlowchart(source));