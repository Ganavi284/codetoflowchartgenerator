#!/usr/bin/env node

// Comprehensive test for if blocks handling for Java
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Comprehensive Testing If Blocks Handling for Java ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./comprehensive-if-test.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./comprehensive-if-test-output.mmd', flowchart);
    console.log("\nFlowchart saved to comprehensive-if-test-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}