import { shapes } from './src/mappings/languages/c/mermaid/shapes.mjs';

console.log('Shapes:');
console.log('start:', shapes.start);
console.log('end:', shapes.end);
console.log('process:', shapes.process);
console.log('decision:', shapes.decision);
console.log('io:', shapes.io);
console.log('return:', shapes.return);
console.log('function:', shapes.function);

// Test return shape
const returnShape = (text) => shapes.return.replace('{}', text);
console.log('returnShape("return 0"):', returnShape("return 0"));