#!/usr/bin/env node

// Test if blocks handling for Java
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing If Blocks Handling for Java ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./test-if-blocks.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./test-if-blocks-output.mmd', flowchart);
    console.log("\nFlowchart saved to test-if-blocks-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}