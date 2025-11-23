// Save the decoded mermaid chart to a file
const fs = require('fs');

const mermaidData = "flowchart TD\n  START([\"start\"])\n  N1[\"let x = prompt('Enter a number:');\"]\n  N2[x = Number(x)]\n  N3{\"if x > 0\"}\n  N4[/\"console.log('Positive')\"/]\n  N5([join])\n  END([\"end\"])\n  START --> N1\n  N1 --> N2\n  N2 --> N3\n  N3 -->|Yes| N4\n  N4 --> N5\n  N3 -->|No| N5\n  N5 --> END";

fs.writeFileSync('test-output.mmd', mermaidData);
console.log('Mermaid flowchart saved to test-output.mmd');