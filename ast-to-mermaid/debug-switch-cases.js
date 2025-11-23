#!/usr/bin/env node

// Debug switch case processing
import { extractJava } from './src/mappings/languages/java/extractors/java-extractor.mjs';
import { normalizeJava } from './src/mappings/languages/java/normalizer/normalize-java.mjs';

const switchCode = `
public class TestSwitch {
    public static void main(String[] args) {
        int day = 3;
        
        switch (day) {
            case 1:
                System.out.println("Monday");
                break;
            case 2:
                System.out.println("Tuesday");
                break;
            case 3:
                System.out.println("Wednesday");
                break;
            default:
                System.out.println("Weekend");
                break;
        }
    }
}
`;

console.log("=== Debugging Switch Cases ===\n");

try {
    console.log("1. Extracting AST...");
    const ast = extractJava(switchCode);
    
    console.log("\n2. Normalizing AST...");
    const normalized = normalizeJava(ast);
    
    console.log("Normalized AST structure:");
    if (normalized && normalized.body) {
        normalized.body.forEach((stmt, index) => {
            console.log(`Statement ${index}: ${stmt.type}`);
            if (stmt.type === 'SwitchStatement') {
                console.log(`  Discriminant:`, stmt.discriminant);
                console.log(`  Cases count:`, stmt.cases ? stmt.cases.length : 0);
                if (stmt.cases) {
                    stmt.cases.forEach((caseNode, caseIndex) => {
                        console.log(`    Case ${caseIndex}:`, JSON.stringify(caseNode, null, 2));
                    });
                }
            }
        });
    }
    
} catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
}