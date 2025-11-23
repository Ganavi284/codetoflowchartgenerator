# AST to Mermaid

Convert Abstract Syntax Trees (AST) to Mermaid diagrams for visualization.

## Installation

```bash
npm install
```

## CLI Usage

```bash
ast2mermaid -l <language> <input-file> [-o <output-file>]
```

### Examples:

```bash
# Convert a JavaScript file to Mermaid diagram
ast2mermaid -l javascript example.js

# Convert a Python file to Mermaid diagram and save to file
ast2mermaid -l python -o diagram.mmd example.py
```

## Supported Languages

- C
- C++
- Java
- JavaScript
- Python
- TypeScript
- Pascal (requires manual parser setup)
- Fortran (requires manual parser setup)

## Parser Setup

For Pascal and Fortran parsers, see instructions in the [parsers/README.md](parsers/README.md) file.

## Development

This project follows a modular structure:

```
ast-to-mermaid/
├── bin/              # CLI executable
├── src/              # Source code
│   ├── extractors/   # AST extraction logic
│   ├── mappings/     # Language-specific mappings
│   ├── mermaid/      # Mermaid diagram generation
│   ├── normalizer/   # AST normalization
│   ├── grammar/      # Language grammar definitions
│   ├── pipeline/     # Processing pipeline
│   ├── types/        # Type definitions
│   ├── fallback/     # Fallback handlers
│   ├── utils/        # Utility functions
│   └── walkers/      # AST traversal
└── parsers/          # Tree-sitter parsers
```

## License

MIT