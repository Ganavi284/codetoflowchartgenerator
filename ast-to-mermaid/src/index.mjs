/**
 * Main entry point for the AST to Mermaid converter
 */
import { extractAST } from './mappings/languages/c/extractors/example-extractor.js';
import { convertAST as convertASTFromPipeline } from './mappings/languages/c/pipeline/emit-mermaid.js';
import { generateFlowchart as generateCFlowchart } from './mappings/languages/c/pipeline/flow.mjs';
import { generateFlowchart as generatePascalFlowchart } from './mappings/languages/pascal/pipeline/flow.mjs';
import { generateFlowchart as generateCppFlowchart } from './mappings/languages/cpp/pipeline/flow.mjs';
import { generateFlowchart as generateFortranFlowchart } from './mappings/languages/fortran/pipeline/flow.mjs';
import { generateFlowchart as generateJavaFlowchart } from './mappings/languages/java/pipeline/flow.mjs';
import { generateFlowchart as generateJavaScriptFlowchart } from './mappings/languages/javascript/pipeline/flow.mjs';
import { generateFlowchart as generatePythonFlowchart } from './mappings/languages/python/pipeline/flow.mjs';
import { generateFlowchart as generateTypeScriptFlowchart } from './mappings/languages/typescript/pipeline/flow.mjs';

export async function convertAST(sourceCode, language) {
  try {
    // Handle flowchart generation for specific languages
    if (language === 'pascal') {
      // Use the Pascal flowchart generator
      return generatePascalFlowchart(sourceCode);
    }
    
    if (language === 'cpp') {
      // Use the C++ flowchart generator
      return await generateCppFlowchart(sourceCode);
    }
    
    if (language === 'fortran') {
      // Use the Fortran flowchart generator
      return generateFortranFlowchart(sourceCode);
    }
    
    if (language === 'java') {
      // Use the Java flowchart generator
      return generateJavaFlowchart(sourceCode);
    }
    
    if (language === 'javascript') {
      // Use the JavaScript flowchart generator
      return generateJavaScriptFlowchart(sourceCode);
    }
    
    if (language === 'python') {
      // Use the Python flowchart generator
      return generatePythonFlowchart(sourceCode);
    }
    
    if (language === 'typescript') {
      // Use the TypeScript flowchart generator
      return generateTypeScriptFlowchart(sourceCode);
    }

    if (language === 'c') {
      // Use C flowchart pipeline with proper if/else support
      return generateCFlowchart(sourceCode);
    }
    
    // Parse the source code using the appropriate tree-sitter parser
    const ast = extractAST(sourceCode, language);
    
    // Convert AST to Mermaid diagram
    const mermaidDiagram = convertASTFromPipeline(ast);
    
    return mermaidDiagram;
  } catch (error) {
    console.error(`Error converting ${language} source code to Mermaid diagram:`, error.message);
    
    // Return a simple placeholder diagram on error
    return `graph TD
    A[Start] --> B{Error}
    B --> C[End]`;
  }
}

export { convertASTFromPipeline };