#!/usr/bin/env node

import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

const javaCode = `class PrintTest {
    static void printMessage(String msg) {
        System.out.println(msg);
    }

    public static void main(String[] args) {
        printMessage("Hello");
    }
}`;

console.log('Testing System.out.println handling:');
console.log('=====================================');
const result = generateFlowchart(javaCode);
console.log(result);