
// Helper function to extract case body from case statements
function extractCaseBody(caseNode) {
  // If we have options from the fallback parser, use them directly
  if (caseNode.options) {
    return caseNode.options.map(option => normalizePascal(option));
  }
  
  if (!caseNode.raw) return [];
  
  // Simple direct approach - just check if there are caseCase sections
  const caseCaseCount = (caseNode.raw.match(/caseCase/g) || []).length;
  if (caseCaseCount > 0) {
    // Return placeholders for each case option
    return Array(caseCaseCount).fill().map((_, index) => ({ 
      type: "CaseOption", 
      value: `option ${index + 1}`, 
      body: { type: "Block", body: [{ type: "Expr", text: `case body ${index + 1}` }] } 
    }));
  }
  
  return [];
}
