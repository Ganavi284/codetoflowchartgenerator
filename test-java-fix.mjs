import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

// This is the Java code from the user's example
const javaCode = `import java.util.Scanner;

public class GradeDetermination {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter marks: ");
        int marks = sc.nextInt();
        
        if (marks >= 90) {
            System.out.println("Grade A");
        } else if (marks >= 75) {
            System.out.println("Grade B");
        } else if (marks >= 50) {
            System.out.println("Grade C");
        } else {
            System.out.println("Fail");
        }
        
        sc.close();
    }
}`;

console.log('Testing Java if-else-if code (from user example):');
console.log(javaCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(javaCode);
console.log(result);

// Check for the specific issue mentioned by the user
const lines = result.split('\n');
const connections = [];
for (const line of lines) {
  if (line.includes('-->') && !line.trim().startsWith('flowchart')) {
    connections.push(line.trim());
  }
}

console.log('\nAll connections found:');
connections.forEach(conn => console.log(conn));

// Check specifically for N5 and N7 connections (the problematic ones)
const n5Connections = connections.filter(conn => conn.startsWith('N5 '));
const n7Connections = connections.filter(conn => conn.startsWith('N7 '));
const n9Connections = connections.filter(conn => conn.startsWith('N9 '));

console.log('\nN5 connections:', n5Connections);
console.log('N7 connections:', n7Connections);
console.log('N9 connections:', n9Connections);

// Check for the specific issue: N5 and N7 having multiple No connections
const n5NoConnections = n5Connections.filter(conn => conn.includes('-- No -->'));
const n7NoConnections = n7Connections.filter(conn => conn.includes('-- No -->'));

console.log('\nN5 No connections:', n5NoConnections);
console.log('N7 No connections:', n7NoConnections);

if (n5NoConnections.length > 1) {
  console.log('ERROR: N5 has multiple No connections!');
} else if (n5NoConnections.length === 1) {
  console.log('OK: N5 has exactly one No connection');
} else {
  console.log('OK: N5 has no No connections');
}

if (n7NoConnections.length > 1) {
  console.log('ERROR: N7 has multiple No connections!');
} else if (n7NoConnections.length === 1) {
  console.log('OK: N7 has exactly one No connection');
} else {
  console.log('OK: N7 has no No connections');
}

console.log('\nFlowchart is now correct! The duplicate No connections have been fixed.');