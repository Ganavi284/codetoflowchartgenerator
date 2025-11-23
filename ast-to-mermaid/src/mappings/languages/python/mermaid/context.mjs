// Context for Mermaid diagram generation
let nodeId = 2; // Start from 2 since N1 is reserved for start node

export function ctx() {
  const context = {
    nodes: [],
    edges: [],
    last: null,
    switchEndNodes: [],
    pendingBreaks: [],
    currentSwitchId: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    
    next() {
      return `N${nodeId++}`;
    },
    
    add(id, label) {
      this.nodes.push(`${id}${label}`);
    },
    
    addEdge(from, to, label = null) {
      if (label) {
        this.edges.push(`${from} -- ${label} --> ${to}`);
      } else {
        this.edges.push(`${from} --> ${to}`);
      }
    },
    
    setLast(id) {
      this.last = id;
    },
    
    // Complete pending branches
    completeBranches() {
      // Handle if statement branches
      if (this.ifConditionId) {
        // If we have an if statement but haven't connected both branches,
        // we need to handle the missing branch
        if (!this.thenBranchConnected) {
          // Connect condition to a dummy "skip then" node with "Yes" label
          // In a full implementation, we would connect to the merge point
        }
        if (!this.elseBranchConnected && this.hasElseBranch) {
          // Connect condition to a dummy "skip else" node with "No" label
          // In a full implementation, we would connect to the merge point
        }
        
        // Mark this if statement as completed
        this.completedIfStatements = this.completedIfStatements || [];
        this.completedIfStatements.push({
          conditionId: this.ifConditionId,
          thenBranchLast: this.thenBranchLast,
          elseBranchLast: this.elseBranchLast,
          hasElseBranch: this.hasElseBranch
        });
        
        // Clear if statement tracking
        this.ifConditionId = null;
        this.thenBranchConnected = false;
        this.elseBranchConnected = false;
        this.hasElseBranch = false;
        this.thenBranchLast = null;
        this.elseBranchLast = null;
        this.ifMergeCandidate = null;
      }
    },
    
    // Track if we're inside an if statement branch
    enterIfBranch() {
      this.ifBranchDepth = (this.ifBranchDepth || 0) + 1;
    },
    
    exitIfBranch() {
      this.ifBranchDepth = Math.max(0, (this.ifBranchDepth || 0) - 1);
    },
    
    isInIfBranch() {
      return (this.ifBranchDepth || 0) > 0;
    },
    
    emit() {
      return [
        'flowchart TD',
        ...this.nodes,
        ...this.edges
      ].join('\n');
    }
  };
  
  return context;
}