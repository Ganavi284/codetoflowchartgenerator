#!/usr/bin/env node

// Debug user's Java code parsing
import { extractJava } from './src/mappings/languages/java/extractors/java-extractor.mjs';
import { normalizeJava } from './src/mappings/languages/java/normalizer/normalize-java.mjs';

const userCode = `
import java.util.Scanner;

public class Sum {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter two numbers: ");
        int a = sc.nextInt();
        int b = sc.nextInt();

        int sum = a + b;
        System.out.println("Sum = " + sum);
    }
}
`;

console.log("=== Debugging User's Java Code ===\n");

try {
    console.log("1. Extracting AST...");
    const ast = extractJava(userCode);
    console.log("AST extracted:", !!ast);
    
    if (ast) {
        console.log("Root node type:", ast.rootNode ? ast.rootNode.type : ast.type);
        console.log("Root node child count:", ast.rootNode ? ast.rootNode.childCount : 'N/A');
        
        // Print children
        if (ast.rootNode) {
            for (let i = 0; i < ast.rootNode.childCount; i++) {
                const child = ast.rootNode.child(i);
                console.log(`  Child ${i}: ${child.type} = "${child.text}"`);
                
                // If this is a class declaration, look deeper
                if (child.type === 'class_declaration') {
                    console.log("    Class declaration child count:", child.childCount);
                    for (let j = 0; j < child.childCount; j++) {
                        const classChild = child.child(j);
                        console.log(`      Class child ${j}: ${classChild.type} = "${classChild.text}"`);
                        
                        // If this is a class body, look deeper
                        if (classChild.type === 'class_body') {
                            console.log("        Class body child count:", classChild.childCount);
                            for (let k = 0; k < classChild.childCount; k++) {
                                const bodyChild = classChild.child(k);
                                console.log(`          Body child ${k}: ${bodyChild.type} = "${bodyChild.text}"`);
                                
                                // If this is a method declaration, look deeper
                                if (bodyChild.type === 'method_declaration') {
                                    console.log("            Method declaration child count:", bodyChild.childCount);
                                    for (let l = 0; l < bodyChild.childCount; l++) {
                                        const methodChild = bodyChild.child(l);
                                        console.log(`              Method child ${l}: ${methodChild.type} = "${methodChild.text}"`);
                                        
                                        // If this is a block, look deeper
                                        if (methodChild.type === 'block') {
                                            console.log("                Block child count:", methodChild.childCount);
                                            for (let m = 0; m < methodChild.childCount; m++) {
                                                const blockChild = methodChild.child(m);
                                                console.log(`                  Block child ${m}: ${blockChild.type} = "${blockChild.text}"`);
                                                
                                                // If this is a local variable declaration, look deeper
                                                if (blockChild.type === 'local_variable_declaration') {
                                                    console.log("                    Local variable declaration child count:", blockChild.childCount);
                                                    for (let n = 0; n < blockChild.childCount; n++) {
                                                        const varChild = blockChild.child(n);
                                                        console.log(`                      Var child ${n}: ${varChild.type} = "${varChild.text}"`);
                                                        
                                                        if (varChild.type === 'variable_declarator') {
                                                            console.log("                        Variable declarator child count:", varChild.childCount);
                                                            for (let o = 0; o < varChild.childCount; o++) {
                                                                const declChild = varChild.child(o);
                                                                console.log(`                          Decl child ${o}: ${declChild.type} = "${declChild.text}"`);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
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