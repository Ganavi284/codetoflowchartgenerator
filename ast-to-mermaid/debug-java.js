#!/usr/bin/env node

// Debug Java AST parsing
import { extractJava } from './src/mappings/languages/java/extractors/java-extractor.mjs';
import { normalizeJava } from './src/mappings/languages/java/normalizer/normalize-java.mjs';

const simpleCode = `
int day = 3;
System.out.println("Test");
`;

console.log("=== Debugging Java AST Parsing ===\n");

try {
    console.log("1. Extracting AST...");
    const ast = extractJava(simpleCode);
    console.log("AST extracted:", !!ast);
    
    if (ast) {
        console.log("Root node type:", ast.rootNode ? ast.rootNode.type : ast.type);
        console.log("Root node child count:", ast.rootNode ? ast.rootNode.childCount : 'N/A');
        
        // Print children
        if (ast.rootNode) {
            for (let i = 0; i < ast.rootNode.childCount; i++) {
                const child = ast.rootNode.child(i);
                console.log(`  Child ${i}: ${child.type} = "${child.text}"`);
            }
        }
    }
    
    console.log("\n2. Normalizing AST...");
    const normalized = normalizeJava(ast);
    console.log("Normalized AST:", JSON.stringify(normalized, null, 2));
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}