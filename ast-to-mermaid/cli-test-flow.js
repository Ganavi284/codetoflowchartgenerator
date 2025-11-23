#!/usr/bin/env node

// CLI test for Java flowchart generation
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== CLI Test for Java Flowchart Generation ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./cli-test.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
    // Also save to a file for easier viewing
    writeFileSync('./cli-test-output.mmd', flowchart);
    console.log("\nFlowchart saved to cli-test-output.mmd");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}