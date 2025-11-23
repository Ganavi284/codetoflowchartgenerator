#!/usr/bin/env node

// Final test of Java switch implementation
import { readFileSync } from 'fs';
import { generateFlowchart } from './src/mappings/languages/java/pipeline/flow.mjs';

console.log("=== Final Test of Java Switch Implementation ===\n");

// Test case 1: Simple switch with break statements
const simpleSwitch = `
public class SimpleSwitch {
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
        
        System.out.println("After switch statement");
    }
}
`;

console.log("Test 1: Simple switch with break statements");
console.log("==========================================");
try {
    const flowchart1 = generateFlowchart(simpleSwitch);
    console.log(flowchart1);
} catch (error) {
    console.error("Error:", error.message);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test case 2: Switch with fall-through
const fallthroughSwitch = `
public class FallthroughSwitch {
    public static void main(String[] args) {
        int value = 2;
        
        switch (value) {
            case 1:
                System.out.println("One");
                // Fall through
            case 2:
                System.out.println("Two");
                // Fall through
            case 3:
                System.out.println("Three");
                break;
            default:
                System.out.println("Other");
                break;
        }
        
        System.out.println("Done");
    }
}
`;

console.log("Test 2: Switch with fall-through");
console.log("================================");
try {
    const flowchart2 = generateFlowchart(fallthroughSwitch);
    console.log(flowchart2);
} catch (error) {
    console.error("Error:", error.message);
}

console.log("\n=== Test Complete ===");