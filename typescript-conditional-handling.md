# How TypeScript Handles Conditionals by Referencing JavaScript Implementation

## Overview

TypeScript conditional handling in this codebase is implemented by closely following the JavaScript implementation. Both languages use similar AST structures and mapping functions, with TypeScript building upon JavaScript's conditional handling patterns.

## Key Similarities Between JavaScript and TypeScript Conditional Handling

### 1. Shared Architecture
- Both JavaScript and TypeScript use identical folder structures for conditional handling
- Both languages have dedicated modules for `if`, `if-else`, and `if-elseif` statements
- The same core mapping functions are used: [mapIfStatement](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/javascript/conditional/if.mjs#L14-L76), [mapIfElseStatement](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/javascript/conditional/if-else/if-else.mjs#L14-L126), and [mapIfElseIfStatement](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/javascript/conditional/if-elseif/if-elseif.mjs#L14-L150)

### 2. Common Implementation Pattern
Both languages implement conditional handling using this pattern:
- Extract AST nodes using Tree-sitter
- Normalize the AST to unified node types
- Map the normalized nodes to Mermaid flowchart elements
- Use decision nodes for conditional statements
- Handle branch connections appropriately

### 3. Conditional Structure Mapping
For the grade checking example:
```typescript
let marks: number = 72;

if (marks >= 90) {
    console.log("Grade A");
} else if (marks >= 75) {
    console.log("Grade B");
} else if (marks >= 50) {
    console.log("Grade C");
} else {
    console.log("Fail");
}
```

Both JavaScript and TypeScript map this to a flowchart with:
- Decision nodes (diamonds) for each conditional check
- "Yes"/"No" branches connecting to appropriate statements
- Proper chaining of else-if statements

## TypeScript-Specific Implementation

### 1. Type Annotations
TypeScript properly handles type annotations like `: number` in variable declarations, which JavaScript doesn't have. The TypeScript extractor recognizes these and includes them in the AST.

### 2. Shared Mapping Functions
TypeScript uses the same core mapping functions as JavaScript, with minor differences in import paths:
- JavaScript: `import { mapIfStatement } from './conditional/if.mjs'`
- TypeScript: `import { mapIfStatement } from './conditional/if.mjs'`

### 3. Pipeline Structure
Both languages follow the same pipeline:
1. [extractTypeScript](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/typescript/extractors/typescript-extractor.mjs#L1-L12)/[extractJavaScript](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/javascript/extractors/javascript-extractor.mjs#L1-L12) → Extract AST
2. [normalizeTypescriptAst](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/typescript/normalizer/normalize-typescript.mjs#L1-L22)/normalizeJavaScript → Normalize AST
3. [mapNodeTypescript](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/typescript/pipeline/flow.mjs#L25-L232)/[mapNodeJavaScript](file:///c:/Users/Administrator/Videos/q2/flow%20updates/ast-to-mermaid/src/mappings/languages/javascript/pipeline/flow.mjs#L31-L66) → Map to flowchart nodes
4. Context emission → Generate Mermaid output

## Results Comparison

### TypeScript Output (Grade Checking Example)
```
flowchart TD
  START(["start"])
  N1["// TypeScript code to demonstrate conditional handling similar to the flowchart"]
  N2["let marks: number = 72;"]
  N3{"if marks >= 90"}
  N4[/"console.log(Grade A)"/]
  N5{"else if marks >= 75"}
  N6[/"console.log(Grade B)"/]
  N7{"else if marks >= 50"}
  N8[/"console.log(Grade C)"/]
  N9[/"console.log(Fail)"/]
  N10[/"console.log(End of grade checking)"/]
  END(["end"])
  START --> N1
  N1 --> N2
  N2 --> N3
  N3 -->|Yes| N4
  N5 -->|Yes| N6
  N7 -->|Yes| N8
  N7 -->|No| N9
  N5 -->|No| N7
  N3 -->|No| N5
  N8 --> N9
  N9 --> END
  N6 --> N8
  N4 --> N5
  N10 --> END
```

### JavaScript Output (Same Logic)
```
flowchart TD
  START(["start"])
  N1["let marks = 72;"]
  N2{"if marks >= 90"}
  N3[/"console.log(Grade A)"/]
  N4{"else if marks >= 75"}
  N5[/"console.log(Grade B)"/]
  N6{"else if marks >= 50"}
  N7[/"console.log(Grade C)"/]
  N8[/"console.log(Fail)"/]
  N9[/"console.log(End of grade checking)"/]
  END(["end"])
  START --> N1
  N1 --> N2
  N2 -->|Yes| N3
  N4 -->|Yes| N5
  N6 -->|Yes| N7
  N6 -->|No| N8
  N4 -->|No| N6
  N2 -->|No| N4
  N7 --> END
  N8 --> END
  N5 --> END
  N3 --> END
  N9 --> END
```

## Key Differences

1. **Variable Declaration**: TypeScript includes type annotations (e.g., `: number`) while JavaScript doesn't
2. **Comment Handling**: TypeScript version includes the comment as a separate node
3. **Branch Connection Logic**: The TypeScript implementation has slightly different logic for connecting branches after conditionals

## Conclusion

TypeScript conditional handling in this codebase is implemented by following the JavaScript implementation pattern very closely. The TypeScript implementation leverages the same core architecture, mapping functions, and flowchart generation logic as JavaScript, with adjustments to handle TypeScript-specific syntax like type annotations. This approach ensures consistency between the two languages while maintaining the ability to process TypeScript's additional syntax elements.