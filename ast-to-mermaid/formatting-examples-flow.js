#!/usr/bin/env node

// Formatting examples for Java flowchart generation
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Formatting Examples for Java Flowchart Generation ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./formatting-examples.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    
    // Save to file
    writeFileSync('./formatting-examples-output.mmd', flowchart);
    console.log("Flowchart saved to formatting-examples-output.mmd");
    
    // Display the key formatting examples
    console.log("\n=== Formatting Conventions Demonstrated ===");
    
    const lines = flowchart.split('\n');
    
    // Example 1: Simple print statement
    console.log("\n1. Simple Print Statement:");
    console.log("   Input:  System.out.println(\"Program started\");");
    const simplePrint = lines.find(line => line.includes('Program started'));
    console.log("   Output:", simplePrint?.trim());
    console.log("   Format: Simple message without 'Print:' prefix");
    
    // Example 2: Input prompt
    console.log("\n2. Input Prompt:");
    console.log("   Input:  System.out.print(\"Enter your name: \");");
    const inputPrompt = lines.find(line => line.includes('Enter your name:'));
    console.log("   Output:", inputPrompt?.trim());
    console.log("   Format: Simple prompt without 'Print:' prefix");
    
    // Example 3: Variable output
    console.log("\n3. Variable Output:");
    console.log("   Input:  System.out.println(\"Hello, \" + name);");
    const varOutput = lines.find(line => line.includes('Hello,') && line.includes('name'));
    console.log("   Output:", varOutput?.trim());
    console.log("   Format: Simple variable message without 'Print:' prefix");
    
    // Example 4: Complex message
    console.log("\n4. Complex Message:");
    console.log("   Input:  System.out.println(\"Processed \" + count + \" items successfully\");");
    const complexMsg = lines.find(line => line.includes('Processed') && line.includes('items successfully'));
    console.log("   Output:", complexMsg?.trim());
    console.log("   Format: Simple complex message without 'Print:' prefix");
    
    // Example 5: Status message
    console.log("\n5. Status Message:");
    console.log("   Input:  System.out.println(\"Operation completed\");");
    const statusMsg = lines.find(line => line.includes('Operation completed'));
    console.log("   Output:", statusMsg?.trim());
    console.log("   Format: Simple status message without 'Print:' prefix");
    
    console.log("\n=== Key Formatting Rules Applied ===");
    console.log("1. Input prompts use parallelogram shape without 'Print:' prefix");
    console.log("2. Output statements use parallelogram shape without 'Print:' prefix");
    console.log("3. String literals are extracted without quotes");
    console.log("4. Variable concatenations are properly processed");
    console.log("5. All IO operations use parallelogram shapes [//]");
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}