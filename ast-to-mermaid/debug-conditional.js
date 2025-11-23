#!/usr/bin/env node

// Debug conditional statements normalization
import { readFileSync } from 'fs';
import { extractJava } from './src/mappings/languages/java/extractors/java-extractor.mjs';
import { normalizeJava } from './src/mappings/languages/java/normalizer/normalize-java.mjs';

console.log("=== Debugging Conditional Statements ===\n");

try {
    // Read the conditional statements Java file
    const javaCode = readFileSync('./test-conditional.java', 'utf8');
    console.log("Java code loaded successfully");
    
    // Extract AST
    console.log("Extracting AST...");
    const ast = extractJava(javaCode);
    console.log("AST extracted successfully");
    
    // Normalize AST
    console.log("Normalizing AST...");
    const normalized = normalizeJava(ast);
    console.log("AST normalized:");
    console.log("===================");
    console.log(JSON.stringify(normalized, null, 2));
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}