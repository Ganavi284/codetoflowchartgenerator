/**
 * Control Flow Manager for handling complex control structures
 * like if-else statements, loops, and switch statements
 */

export class ControlFlowManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.controlStack = [];
  }

  /**
   * Enter a control structure (if, loop, switch, etc.)
   */
  enterControlStructure(type, info) {
    const controlStructure = {
      type,
      id: this.ctx.next(),
      ...info,
      branches: [] // For tracking branch endpoints
    };
    
    this.controlStack.push(controlStructure);
    return controlStructure.id;
  }

  /**
   * Exit a control structure
   */
  exitControlStructure() {
    return this.controlStack.pop();
  }

  /**
   * Get the current control structure
   */
  getCurrentControlStructure() {
    return this.controlStack.length > 0 ? 
      this.controlStack[this.controlStack.length - 1] : null;
  }

  /**
   * Add a branch endpoint
   */
  addBranchEndpoint(endpointId) {
    const current = this.getCurrentControlStructure();
    if (current) {
      current.branches.push(endpointId);
    }
  }

  /**
   * Connect branches to a merge point
   */
  connectBranchesToMerge(mergeId) {
    const current = this.getCurrentControlStructure();
    if (current && current.branches.length > 0) {
      current.branches.forEach(branchEnd => {
        if (branchEnd) {
          this.ctx.addEdge(branchEnd, mergeId);
        }
      });
      current.branches = [];
    }
  }
}