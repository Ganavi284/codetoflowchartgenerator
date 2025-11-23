import { ctx } from './src/mappings/languages/c/mermaid/context.mjs';

console.log('Testing context initialization...');

const context = ctx();
console.log('First ID:', context.next());
console.log('Second ID:', context.next());
console.log('Third ID:', context.next());