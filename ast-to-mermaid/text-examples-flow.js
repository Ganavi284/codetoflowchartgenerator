#!/usr/bin/env node

// Text examples for Java flowchart generation
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Text Examples for Java Flowchart Generation ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./text-examples.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    
    // Save to file
    writeFileSync('./text-examples-output.mmd', flowchart);
    console.log("Flowchart saved to text-examples-output.mmd");
    
    // Extract and display key text examples
    const lines = flowchart.split('\n');
    
    console.log("\n=== Text Handling Examples ===");
    
    // Example 1: Simple string literal
    console.log("\n1. Simple String Literal:");
    console.log("   Code: System.out.println(\"Welcome to the program\");");
    const simpleLiteral = lines.find(line => line.includes('Welcome to the program'));
    console.log("   Flowchart:", simpleLiteral?.trim());
    
    // Example 2: String with variable concatenation
    console.log("\n2. String with Variable Concatenation:");
    console.log("   Code: System.out.println(\"Hello, \" + userName + \"!\");");
    const varConcat = lines.find(line => line.includes('Hello,') && line.includes('!'));
    console.log("   Flowchart:", varConcat?.trim());
    
    // Example 3: Numeric output with variable
    console.log("\n3. Numeric Output with Variable:");
    console.log("   Code: System.out.println(\"Your score is: \" + score + \" points\");");
    const numOutput = lines.find(line => line.includes('Your score is:'));
    console.log("   Flowchart:", numOutput?.trim());
    
    // Example 4: Multiple variables in output
    console.log("\n4. Multiple Variables in Output:");
    console.log("   Code: System.out.println(\"Attempt \" + attempts + \" of \" + score);");
    const multiVar = lines.find(line => line.includes('Attempt') && line.includes('of'));
    console.log("   Flowchart:", multiVar?.trim());
    
    // Example 5: Input prompt
    console.log("\n5. Input Prompt:");
    console.log("   Code: System.out.print(\"Enter your age: \");");
    const inputPrompt = lines.find(line => line.includes('Enter your age:'));
    console.log("   Flowchart:", inputPrompt?.trim());
    
    // Example 6: Input operation
    console.log("\n6. Input Operation:");
    console.log("   Code: int age = input.nextInt();");
    const inputOp = lines.find(line => line.includes('read int') && line.includes('age'));
    console.log("   Flowchart:", inputOp?.trim());
    
    // Example 7: Conditional output
    console.log("\n7. Conditional Output:");
    console.log("   Code: System.out.println(\"You are eligible to vote\");");
    const condOutput = lines.find(line => line.includes('eligible to vote'));
    console.log("   Flowchart:", condOutput?.trim());
    
    // Example 8: Loop output
    console.log("\n8. Loop Output:");
    console.log("   Code: System.out.println(\"Processing item \" + i);");
    const loopOutput = lines.find(line => line.includes('Processing item'));
    console.log("   Flowchart:", loopOutput?.trim());
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}