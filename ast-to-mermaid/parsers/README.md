# Tree-sitter Parsers

This directory contains the tree-sitter parsers for different languages.

## Git Clone Commands

To manually clone the required parsers, use the following commands:

### Fortran Parser
```bash
git clone https://github.com/stadelmanma/tree-sitter-fortran.git
```

### Pascal Parser
```bash
git clone https://github.com/Isopod/tree-sitter-pascal.git
```

## Rebuild Commands

After cloning, you'll need to rebuild each parser:

```bash
cd tree-sitter-fortran
npm install
npm run build

cd ../tree-sitter-pascal
npm install
npm run build
```

## Installation Commands for Other Languages

To install tree-sitter libraries for the other 6 languages:

```bash
npm install tree-sitter-javascript
npm install tree-sitter-typescript
npm install tree-sitter-java
npm install tree-sitter-c
npm install tree-sitter-cpp
npm install tree-sitter-python
```

## Install Mermaid

To install mermaid:

```bash
npm install mermaid
```