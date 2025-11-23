#!/usr/bin/env node

// Test block if-else handling
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing Block If-Else Handling ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./if-else-block.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    
    console.log("\n=== Generated Flowchart ===");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./if-else-block-output.mmd', flowchart);
    console.log("\nFlowchart saved to if-else-block-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}