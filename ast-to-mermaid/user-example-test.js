#!/usr/bin/env node

// Test user's if-else example
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing User's If-Else Example ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./user-example.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    
    console.log("\n=== Generated Flowchart ===");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./user-example-output.mmd', flowchart);
    console.log("\nFlowchart saved to user-example-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}