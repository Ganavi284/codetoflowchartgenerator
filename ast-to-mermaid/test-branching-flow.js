#!/usr/bin/env node

// Test branching behavior for Java flowchart generation
import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing Branching Behavior for Java Flowchart ===\n");

try {
    // Read the branching test Java file
    const javaCode = readFileSync('./test-branching.java', 'utf8');
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