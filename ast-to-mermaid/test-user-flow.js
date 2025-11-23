#!/usr/bin/env node

// Test user's Java code
import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing User's Java Code ===\n");

try {
    // Read the user's Java file
    const javaCode = readFileSync('./test-user-code.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}