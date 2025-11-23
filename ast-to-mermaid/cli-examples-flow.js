#!/usr/bin/env node

// CLI examples for Java flowchart generation
import { readFileSync, writeFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== CLI Examples for Java Flowchart Generation ===\n");

try {
    // Read the Java file
    const javaCode = readFileSync('./cli-examples.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Generate flowchart
    console.log("Generating flowchart...");
    const flowchart = generateFlowchart(javaCode);
    console.log("Flowchart generated:");
    console.log("===================");
    console.log(flowchart);
    
    // Also save to a file for easier viewing
    writeFileSync('./cli-examples-output.mmd', flowchart);
    console.log("\nFlowchart saved to cli-examples-output.mmd");
    
    // Let's also show some specific examples of text handling
    console.log("\n=== Text Handling Examples ===");
    
    // Example of simple print statement
    const simplePrintCode = `
public class SimplePrint {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`;
    
    console.log("\n1. Simple Print Statement:");
    console.log("Code: System.out.println(\"Hello World\");");
    const simplePrintFlow = generateFlowchart(simplePrintCode);
    // Extract the relevant part
    const simplePrintLines = simplePrintFlow.split('\n').filter(line => line.includes('Hello World'));
    console.log("Flowchart node:", simplePrintLines[0]);
    
    // Example of print with variable
    const varPrintCode = `
public class VarPrint {
    public static void main(String[] args) {
        int x = 5;
        System.out.println("Value is: " + x);
    }
}`;
    
    console.log("\n2. Print with Variable:");
    console.log("Code: System.out.println(\"Value is: \" + x);");
    const varPrintFlow = generateFlowchart(varPrintCode);
    // Extract the relevant part
    const varPrintLines = varPrintFlow.split('\n').filter(line => line.includes('Value is:'));
    console.log("Flowchart node:", varPrintLines[0]);
    
    // Example of input operation
    const inputCode = `
public class InputExample {
    public static void main(String[] args) {
        java.util.Scanner sc = new java.util.Scanner(System.in);
        System.out.print("Enter value: ");
        int value = sc.nextInt();
    }
}`;
    
    console.log("\n3. Input Operation:");
    console.log("Code: int value = sc.nextInt();");
    const inputFlow = generateFlowchart(inputCode);
    // Extract the relevant part
    const inputLines = inputFlow.split('\n').filter(line => line.includes('read') || line.includes('Enter value'));
    inputLines.forEach(line => console.log("Flowchart node:", line));
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}