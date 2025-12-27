#!/usr/bin/env node

// Test comprehensive conditional statements flowchart generation
import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Testing Comprehensive Conditional Statements Flowchart ===\n");

try {
    // Read the comprehensive conditional statements Java file
    const javaCode = readFileSync('./test-conditional-comprehensive.java', 'utf8');
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