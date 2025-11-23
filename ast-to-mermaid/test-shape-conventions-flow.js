#!/usr/bin/env node

// Test shape conventions for Java flowchart generation
import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing Shape Conventions for Java Flowchart ===\n");

try {
    // Read the shape conventions Java file
    const javaCode = readFileSync('./test-shape-conventions.java', 'utf8');
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