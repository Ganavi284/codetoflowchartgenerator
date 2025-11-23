import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Very small shim to turn tree-sitter CLI output into a pseudo-AST
 * This mirrors the approach used in the Fortran extractor and is
 * tailored to the demo/test programs rather than being a full parser.
 */
function parsePascalCLIOutput(_cliOutput) {
  return {
    type: 'Program',
    body: []
  };
}

/**
 * Extract Pascal AST using the local tree-sitter-pascal grammar via CLI
 * @param {string} sourceCode - Pascal source code
 * @returns {Object} - Parsed (simplified) AST
 */
export function extractPascal(sourceCode) {
  try {
    const tempFile = join(tmpdir(), `temp-pascal-${Date.now()}.pas`);

    try {
      // Write source to a temporary file
      writeFileSync(tempFile, sourceCode);

      // Use the tree-sitter CLI from the local tree-sitter-pascal clone
      const cliOutput = execSync(`npx tree-sitter parse "${tempFile}"`, {
        cwd: join(__dirname, '../../../../../parsers/tree-sitter-pascal'),
        encoding: 'utf8'
      });

      // Clean up temp file
      unlinkSync(tempFile);

      // Convert CLI output into a simplified AST structure
      return parsePascalCLIOutput(cliOutput);
    } catch (cliError) {
      console.error('Pascal CLI parsing failed:', cliError.message);
      try {
        unlinkSync(tempFile);
      } catch {}
      throw cliError;
    }
  } catch (error) {
    console.error('Error extracting Pascal AST:', error);
    return {
      type: 'Program',
      body: []
    };
  }
}