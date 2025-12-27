import { shapes } from "../../mermaid/shapes.mjs";
import { linkNext } from "../../mappings/common/common.mjs";

// Helper function to create decision shape with text
const decisionShape = (text) => shapes.decision.replace('{}', text);

// Helper function to create process shape with text
const processShape = (text) => shapes.process.replace('{}', text);

/**
 * Map switch statement to Mermaid flowchart nodes
 * Creates decision node for switch with case branches
 * @param {Object} node - Normalized switch statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapSwitchStatement(node, ctx) {
  // Set up the switch end node placeholder before processing the switch
  if (!ctx.switchEndNodes) {
    ctx.switchEndNodes = [];
  }
  ctx.switchEndNodes.push(null); // Placeholder for end node ID
  
  // Create the switch node
  const id = ctx.next();
  // Get the switch discriminant text
  let discriminantText = "expression";
  if (node.discriminant) {
    // If discriminant has direct text
    if (node.discriminant.text) {
      discriminantText = node.discriminant.text;
    }
    // If discriminant is an identifier with a name
    else if (node.discriminant.name) {
      discriminantText = node.discriminant.name;
    }
    // If discriminant has an expression with a name (like ExpressionStatement with Identifier)
    else if (node.discriminant.expression && node.discriminant.expression.name) {
      discriminantText = node.discriminant.expression.name;
    }
    // If discriminant is a literal with a value
    else if (node.discriminant.expression && node.discriminant.expression.value !== undefined) {
      discriminantText = node.discriminant.expression.value;
    }
    // Fallback: extract from the full switch statement text
    else if (node.text) {
      const match = node.text.match(/switch\s*\(([^)]+)\)/);
      if (match && match[1]) {
        discriminantText = match[1].trim();
      }
    }
  }
  ctx.add(id, decisionShape("switch (" + discriminantText + ")"));
  
  // Connect to previous node using shared linking logic
  linkNext(ctx, id);
  
  // Store the switch node ID for later use in case connections
  ctx.currentSwitchId = id;
  
  // Store the start node for this switch to connect to the end later
  if (!ctx.switchStartNodes) {
    ctx.switchStartNodes = [];
  }
  ctx.switchStartNodes.push(id);
}

/**
 * Map case statement to Mermaid flowchart nodes
 * Creates process node for case statement
 * @param {Object} node - Normalized case statement node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapCase(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for case statement
  const caseId = ctx.next();
  // Fix: Get the case value from node.test.value instead of node.test.text
  const caseValue = node.test ? (node.test.value !== undefined ? node.test.value : node.test.text) : "";
  const caseText = `case ${caseValue}:`;
  ctx.add(caseId, processShape(caseText));
  
  // Connect from switch node to this case
  if (ctx.currentSwitchId) {
    ctx.addEdge(ctx.currentSwitchId, caseId);
  }
  
  // Set as last node to maintain sequential flow within cases
  ctx.last = caseId;
  
  // Track the previous case for potential fall-through handling
  ctx.previousCaseId = caseId;
}

/**
 * Map default case to Mermaid flowchart nodes
 * Creates process node for default case
 * @param {Object} node - Normalized default case node
 * @param {Object} ctx - Context for flowchart generation
 */
export function mapDefault(node, ctx) {
  if (!node || !ctx) return;
  
  // Create process node for default case
  const defaultId = ctx.next();
  const defaultText = "default:";
  ctx.add(defaultId, processShape(defaultText));
  
  // Connect from switch node to this default case
  if (ctx.currentSwitchId) {
    ctx.addEdge(ctx.currentSwitchId, defaultId);
  }
  
  // Set as last node to maintain sequential flow within cases
  ctx.last = defaultId;
  
  // Track the previous case for potential fall-through handling
  ctx.previousCaseId = defaultId;
}

/**
 * Complete the switch statement by connecting break statements and creating end node
 * @param {Object} ctx - Context for flowchart generation
 */
export function completeSwitch(ctx) {
  if (!ctx) return;
  
  // Store the current last node before we modify it
  const originalLast = ctx.last;
  
  // Store pending breaks for this switch level before processing
  const breaksForCurrentSwitch = ctx.pendingBreaks && ctx.pendingBreaks.length > 0 ? 
    ctx.pendingBreaks.filter(breakInfo => 
      breakInfo.switchLevel === (ctx.switchEndNodes.length - 1)
    ) : [];
  
  // Create an end node for the switch statement
  const switchEndId = ctx.next();
  
  // Connect any pending break statements to the switch end node
  if (breaksForCurrentSwitch && breaksForCurrentSwitch.length > 0) {
    breaksForCurrentSwitch.forEach(breakInfo => {
      ctx.addEdge(breakInfo.breakId, switchEndId);
    });
    
    // Remove processed breaks
    ctx.pendingBreaks = ctx.pendingBreaks.filter(breakInfo => 
      breakInfo.switchLevel !== (ctx.switchEndNodes.length - 1)
    );
  }
  
  // Connect the switch start to the end node for cases that don't have breaks
  if (ctx.switchStartNodes && ctx.switchStartNodes.length > 0) {
    const switchStartId = ctx.switchStartNodes.pop();
    
    // Connect switch start to end for fall-through cases without breaks
    // This is a simplified approach - in a real implementation we'd need to handle 
    // the actual control flow between cases
    
    // For now, we'll just make sure the end node exists
    ctx.add(switchEndId, '(["switch end"])');
    
    // Update the switch end node placeholder
    if (ctx.switchEndNodes && ctx.switchEndNodes.length > 0) {
      ctx.switchEndNodes[ctx.switchEndNodes.length - 1] = switchEndId;
    }
    
    // Set this as the last node for subsequent connections
    ctx.last = switchEndId;
  }
  
  // Connect the original last statement in the matched case (if no break) to the switch end
  // This handles fallthrough behavior when a case doesn't have a break statement
  // First, check if the original last node is NOT a break statement from this switch
  const isOriginalLastABreak = breaksForCurrentSwitch.some(breakInfo => breakInfo.breakId === originalLast);
  if (originalLast && !isOriginalLastABreak) {
    // Connect original last node to switch end for fallthrough behavior
    ctx.addEdge(originalLast, switchEndId);
  }
}