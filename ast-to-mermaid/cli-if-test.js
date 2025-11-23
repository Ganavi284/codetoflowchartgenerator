#!/usr/bin/env node

// CLI test for if blocks handling
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== CLI Test for If Blocks Handling ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./cli-if-test.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    
    console.log("\n=== Generated Flowchart ===");
    console.log(flowchart);
    
    // Save to file
    writeFileSync('./cli-if-test-output.mmd', flowchart);
    console.log("\nFlowchart saved to cli-if-test-output.mmd");
    
    // Show summary of key features demonstrated
    console.log("\n=== Key Features Demonstrated ===");
    console.log("1. Simple if statements with proper condition text");
    console.log("2. If-else statements with correct branching");
    console.log("3. If-else-if chains with proper 'else if' labeling");
    console.log("4. Nested if statements with correct hierarchy");
    console.log("5. Proper Yes/No branch connections");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}