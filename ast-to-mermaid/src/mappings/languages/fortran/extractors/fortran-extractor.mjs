import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir, homedir } from 'os';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FORTRAN_PARSER_DIR = join(__dirname, '../../../../../parsers/tree-sitter-fortran');

/**
 * Parse tree-sitter CLI output into a structured AST
 * @param {string} cliOutput - Output from tree-sitter CLI
 * @param {string} sourceCode - Original source
 * @returns {Object} - Simplified AST
 */
function parseCLIOutput(cliOutput, sourceCode) {
  const start = cliOutput.indexOf('(');
  if (start === -1) {
    return { type: 'ERROR', children: [] };
  }

  const content = cliOutput.slice(start);
  const stack = [{ type: 'ROOT', children: [] }];
  let pendingField = null;
  let i = 0;

  while (i < content.length) {
    const char = content[i];

    if (char === '(') {
      i++;
      while (i < content.length && /\s/.test(content[i])) i++;
      let type = '';
      while (i < content.length && !/[\s()]/.test(content[i])) {
        type += content[i++];
      }
      const node = { type, children: [] };
      if (pendingField) {
        node.field = pendingField;
        pendingField = null;
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else if (char === ')') {
      stack.pop();
      i++;
    } else if (char === '[') {
      const closing = content.indexOf(']', i);
      if (closing === -1) break;
      const coords = content
        .slice(i + 1, closing)
        .split(',')
        .map(num => parseInt(num.trim(), 10));
      const current = stack[stack.length - 1];
      if (current) {
        if (!current.start) {
          current.start = coords;
        } else {
          current.end = coords;
        }
      }
      i = closing + 1;
    } else if (/[A-Za-z_]/.test(char)) {
      let token = '';
      while (i < content.length && /[A-Za-z0-9_]/.test(content[i])) {
        token += content[i++];
      }
      if (content[i] === ':') {
        pendingField = token;
        i++;
      }
    } else {
      i++;
    }
  }

  const root = stack[0].children[0] || { type: 'ERROR', children: [] };
  annotatePositions(root, sourceCode);
  return root;
}

function annotatePositions(node, sourceCode) {
  if (!node || !sourceCode) return;

  const lineOffsets = getLineOffsets(sourceCode);
  traverse(node, n => {
    if (n.start) {
      n.startIndex = positionToIndex(n.start[0], n.start[1], lineOffsets);
    }
    if (n.end) {
      n.endIndex = positionToIndex(n.end[0], n.end[1], lineOffsets);
    }
    if (typeof n.startIndex === 'number' && typeof n.endIndex === 'number') {
      n.text = sourceCode.slice(n.startIndex, n.endIndex);
    }
    delete n.start;
    delete n.end;
  });
}

function traverse(node, cb) {
  if (!node) return;
  cb(node);
  (node.children || []).forEach(child => traverse(child, cb));
}

function getLineOffsets(source) {
  const offsets = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') {
      offsets.push(i + 1);
    }
  }
  return offsets;
}

function positionToIndex(row, column, offsets) {
  const lineStart = offsets[row] ?? 0;
  return lineStart + column;
}

/**
 * Extract Fortran AST using Tree-sitter CLI
 * @param {string} sourceCode - Fortran source code
 * @returns {Object} - Parsed AST
 */
export function extractFortran(sourceCode) {
  try {
    ensureTreeSitterConfig();
    const tempFile = join(tmpdir(), `temp-fortran-${Date.now()}.f90`);
    try {
      writeFileSync(tempFile, sourceCode);
      const cliOutput = execSync(`npx tree-sitter parse "${tempFile}"`, {
        cwd: FORTRAN_PARSER_DIR,
        encoding: 'utf8'
      });
      unlinkSync(tempFile);
      return parseCLIOutput(cliOutput, sourceCode);
    } catch (cliError) {
      console.error('CLI parsing failed:', cliError.message);
      try {
        unlinkSync(tempFile);
      } catch (cleanupError) {
        // ignore cleanup errors
      }
      throw cliError;
    }
  } catch (error) {
    console.error('Error extracting Fortran AST:', error);
    return {
      type: 'ERROR',
      body: []
    };
  }
}

function ensureTreeSitterConfig() {
  try {
    const configDir = join(homedir(), '.tree-sitter');
    const configFile = join(configDir, 'config.json');
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true });
    }

    let config = { 'parser-directories': [] };
    if (existsSync(configFile)) {
      try {
        config = JSON.parse(readFileSync(configFile, 'utf8'));
      } catch (error) {
        // fallback to default structure
        config = { 'parser-directories': [] };
      }
    }

    if (!config['parser-directories'].includes(FORTRAN_PARSER_DIR)) {
      config['parser-directories'].push(FORTRAN_PARSER_DIR);
      writeFileSync(configFile, JSON.stringify(config, null, 2));
    }
  } catch (error) {
    console.warn('Unable to configure tree-sitter parser directories:', error.message);
  }
}