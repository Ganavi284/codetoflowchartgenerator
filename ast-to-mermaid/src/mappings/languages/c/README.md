# C Language Mapping

This directory contains all the mapping definitions for converting C language AST nodes to Mermaid diagram elements.

## Structure

- `c-config.mjs` - Configuration for the C language mapping system
- `c.mjs` - Main dispatcher for all C language constructs
- `c-common.mjs` - Common helper functions for C mapping
- `shared/helpers.mjs` - Shared utilities for AST manipulation
- `conditional/` - Mapping for if/else, switch/case statements
- `loops/` - Mapping for for, while, do-while loops
- `functions/` - Mapping for function definitions and calls
- `other-statements/` - Mapping for declarations, assignments, returns, etc.
- `io/` - Mapping for input/output operations
- `error-handling/` - Mapping for error handling constructs
- `mixed-statements/` - Mapping for nested and mixed constructs

## Supported Constructs

- Conditionals (if, else-if, switch-case)
- Loops (for, while, do-while)
- Functions (definitions, calls)
- Declarations and assignments
- Return statements
- Input/Output operations
- Error handling
- Mixed nested statements