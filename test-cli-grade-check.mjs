import { generateFlowchart } from './ast-to-mermaid/src/mappings/languages/java/pipeline/flow.mjs';

const javaCode = `import java.util.Scanner;

public class GradeCheck {
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

console.log('Testing CLI Java code:');
console.log(javaCode);
console.log('\nGenerated flowchart:');
const result = generateFlowchart(javaCode);
console.log(result);

// Check for duplicate No connections specifically
const lines = result.split('\n');
const connections = [];
for (const line of lines) {
  if (line.includes('-->') && !line.trim().startsWith('flowchart')) {
    connections.push(line.trim());
  }
}

console.log('\nAll connections:');
connections.forEach(conn => console.log(conn));

// Find if/else if decision nodes and check for duplicate No connections
const decisionNodes = [];
connections.forEach(conn => {
  if (conn.includes('{if ') || conn.includes('{else if ')) {
    const nodeId = conn.split('[')[0].trim();
    decisionNodes.push(nodeId);
  }
});

console.log('\nDecision nodes found:', decisionNodes);

// Check for duplicate No connections from the same node
const noConnections = connections.filter(conn => conn.includes('-- No -->'));
console.log('\nNo connections found:', noConnections);

// Group No connections by source node
const noConnectionsByNode = {};
noConnections.forEach(conn => {
  const match = conn.match(/^(N\d+) -- No -->/);
  if (match) {
    const nodeId = match[1];
    if (!noConnectionsByNode[nodeId]) {
      noConnectionsByNode[nodeId] = [];
    }
    noConnectionsByNode[nodeId].push(conn);
  }
});

console.log('\nNo connections grouped by source node:');
for (const [nodeId, conns] of Object.entries(noConnectionsByNode)) {
  console.log(`${nodeId}: ${conns.length} No connection(s) - ${conns.join(', ')}`);
  if (conns.length > 1) {
    console.log(`  ERROR: Node ${nodeId} has multiple No connections!`);
  } else {
    console.log(`  OK: Node ${nodeId} has exactly one No connection`);
  }
}

// Check if there are any duplicate No connections
let hasDuplicateNoConnections = false;
for (const [nodeId, conns] of Object.entries(noConnectionsByNode)) {
  if (conns.length > 1) {
    hasDuplicateNoConnections = true;
  }
}

if (hasDuplicateNoConnections) {
  console.log('\n❌ FAILED: Duplicate No connections found!');
} else {
  console.log('\n✅ SUCCESS: No duplicate No connections found!');
  console.log('The fix is working correctly.');
}