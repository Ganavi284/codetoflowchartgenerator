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
    
    // Handle branch connections for conditional nodes
    handleBranchConnection(id, options = {}) {
      if (!this.pendingBranchConnections) {
        this.pendingBranchConnections = [];
      }
      
      // For decision nodes, we need to handle Yes/No branches
      if (this.last && this.last !== id) {
        // Determine if this is a Yes or No branch based on context
        // For now, default to connecting normally
        if (!options.skipEdge) {
          this.addEdge(this.last, id);
        }
      }
      
      this.last = id;
      return false; // Not joined
    },
    
    // Complete a loop by connecting the last node back to the loop condition
    completeLoop() {
      if (this.inLoop && this.loopContinueNode && this.last && this.last !== this.loopContinueNode) {
        // Connect the last processed node back to the loop condition/decision node
        this.addEdge(this.last, this.loopContinueNode);
        // Reset loop state
        this.inLoop = false;
        this.loopContinueNode = null;
      }
    },
    
    // Enter a branch (for if statements)
    enterBranch(branchType) {
      if (!this.activeBranches) {
        this.activeBranches = [];
      }
      this.activeBranches.push(branchType);
    },
    
    // Exit a branch (for if statements)
    exitBranch(branchType) {
      if (this.activeBranches && this.activeBranches.length > 0) {
        this.activeBranches.pop();
      }
    },
    
    // Function definitions and subgraphs
    functionDefinitions: new Map(),
    subgraphs: {},
    
    addSubgraph(id, title, nodes, edges) {
      this.subgraphs[id] = { title, nodes, edges };
    },
    
    emit() {
      const result = ['flowchart TD'];
      
      // Add regular nodes
      result.push(...this.nodes);
      
      // Add subgraphs
      for (const [id, subgraph] of Object.entries(this.subgraphs)) {
        result.push(`subgraph ${id}["${subgraph.title}"]`);
        result.push(...subgraph.nodes);
        result.push(...subgraph.edges);
        result.push('end');
      }
      
      // Add edges
      result.push(...this.edges);
      
      return result.join('\n');
    },
    
    // Execute a function body in a subgraph
    executeFunctionBody(funcDef, funcName) {
      if (!funcDef || !funcDef.body) return;
      
      // Create a subgraph for the function
      const subgraphId = `SG${Object.keys(this.subgraphs).length + 1}`;
      const subgraphTitle = `function ${funcDef.name || funcName}`;
      
      // Create temporary context for the subgraph
      const subgraphCtx = {
        nodes: [],
        edges: [],
        last: null,
        next: () => `SGN${nodeId++}`, // Use different ID generator for subgraph nodes
        add: function(id, label) { this.nodes.push(`${id}${label}`); },
        addEdge: function(from, to, label = null) {
          if (label) {
            this.edges.push(`${from} -- ${label} --> ${to}`);
          } else {
            this.edges.push(`${from} --> ${to}`);
          }
        },
        setLast: function(id) { this.last = id; },
        // Include other needed methods
        handleBranchConnection: this.handleBranchConnection,
        completeBranches: this.completeBranches,
        functionDefinitions: this.functionDefinitions,
        executeFunctionBody: this.executeFunctionBody,
        functionCallHandler: this.functionCallHandler,
        // Set subgraph context so mapping functions know to use this context
        subgraphContext: null,
        addSubgraph: this.addSubgraph,
        subgraphs: this.subgraphs,
        ifConditionId: null,
        thenBranchConnected: false,
        elseBranchConnected: false,
        hasElseBranch: false,
        thenBranchLast: null,
        elseBranchLast: null,
        ifMergeCandidate: null,
        ifBranchDepth: 0,
        completedIfStatements: [],
        pendingBranchConnections: [],
        activeBranches: [],
        inLoop: false,
        loopContinueNode: null,
        switchEndNodes: [],
        pendingBreaks: [],
        currentSwitchId: null,
        deferredStatements: [],
        // Store the original context for connections
        originalContext: this
      };
      
      // Execute the function body in the subgraph context
      if (Array.isArray(funcDef.body)) {
        for (const child of funcDef.body) {
          if (child && child.type !== 'Expr' && child.type !== 'def' && child.type !== 'function_name' && child.type !== 'parameters' && child.type !== 'colon') {
            if (this.functionCallHandler && typeof this.functionCallHandler === 'function') {
              // Create a modified context that uses the subgraph context
              const modifiedContext = Object.assign({}, this, {
                subgraphContext: subgraphCtx
              });
              this.functionCallHandler(child, modifiedContext);
            }
          }
        }
      } else {
        if (this.functionCallHandler && typeof this.functionCallHandler === 'function') {
          // Create a modified context that uses the subgraph context
          const modifiedContext = Object.assign({}, this, {
            subgraphContext: subgraphCtx
          });
          this.functionCallHandler(funcDef.body, modifiedContext);
        }
      }
      
      // Add the subgraph to the main context
      this.addSubgraph(subgraphId, subgraphTitle, subgraphCtx.nodes, subgraphCtx.edges);
      
      // Return the subgraph ID so caller can make connections
      return subgraphId;
    }
  };
  
  return context;
}