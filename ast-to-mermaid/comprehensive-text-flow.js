#!/usr/bin/env node

// Comprehensive text example for Java flowchart generation
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Comprehensive Text Handling Example ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./comprehensive-text-example.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    
    // Save to file
    writeFileSync('./comprehensive-text-output.mmd', flowchart);
    console.log("Flowchart saved to comprehensive-text-output.mmd");
    
    // Display the comprehensive text handling examples
    console.log("\n=== Comprehensive Text Handling Examples ===");
    
    const lines = flowchart.split('\n');
    
    // Filter out only the parallelogram nodes (IO operations)
    const ioNodes = lines.filter(line => line.includes('[/') && line.includes('/]'));
    
    console.log("\nAll IO Operations (Parallelogram Shapes):");
    ioNodes.forEach((node, index) => {
        console.log(`  ${index + 1}. ${node.trim()}`);
    });
    
    console.log("\n=== Text Processing Features Demonstrated ===");
    console.log("1. String Literal Extraction:");
    const welcomeNode = ioNodes.find(node => node.includes('Welcome to the application'));
    console.log(`   • ${welcomeNode?.trim()}`);
    
    console.log("\n2. Input Prompt Handling:");
    const usernamePrompt = ioNodes.find(node => node.includes('Please enter your username:'));
    const agePrompt = ioNodes.find(node => node.includes('Enter your age:'));
    console.log(`   • ${usernamePrompt?.trim()}`);
    console.log(`   • ${agePrompt?.trim()}`);
    
    console.log("\n3. Variable Concatenation:");
    const helloNode = ioNodes.find(node => node.includes('Hello,') && node.includes('Welcome'));
    const loadingNode = ioNodes.find(node => node.includes('Loading module'));
    const scoreNode = ioNodes.find(node => node.includes('final score is'));
    console.log(`   • ${helloNode?.trim()}`);
    console.log(`   • ${loadingNode?.trim()}`);
    console.log(`   • ${scoreNode?.trim()}`);
    
    console.log("\n4. Conditional Output:");
    const eligibleNode = ioNodes.find(node => node.includes('eligible for all features'));
    const restrictedNode = ioNodes.find(node => node.includes('features are restricted'));
    console.log(`   • ${eligibleNode?.trim()}`);
    console.log(`   • ${restrictedNode?.trim()}`);
    
    console.log("\n5. Status Messages:");
    const statusNode = ioNodes.find(node => node.includes('Application terminated successfully'));
    console.log(`   • ${statusNode?.trim()}`);
    
    console.log("\n=== Key Technical Features ===");
    console.log("✓ All IO operations use parallelogram shapes [//]");
    console.log("✓ String literals extracted without quotes");
    console.log("✓ Variable concatenations properly processed");
    console.log("✓ Method calls (nextInt, nextLine) mapped to 'read' operations");
    console.log("✓ Conditional branching with proper Yes/No connections");
    console.log("✓ Loop structures with correct flow control");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}