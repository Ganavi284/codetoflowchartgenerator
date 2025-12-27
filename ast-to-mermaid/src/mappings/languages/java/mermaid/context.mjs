// Context for Mermaid diagram generation
const createState = () => ({
  nodeId: 2,        // Start from 2 since N1 is reserved for start node
  subgraphId: 1,    // Counter for subgraphs
});

export function ctx(sharedState = null) {
  const state = sharedState || createState();

  const context = {
    state,
    nodes: [],
    edges: [],
    last: null,
    switchEndNodes: [],
    pendingBreaks: [],
    pendingLoops: [],
    currentSwitchId: null,
    currentLoop: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    ifStack: [],
    pendingJoins: [],
    previousCaseId: null,  // Track previous case for fall-through handling
    functionMap: {}, // Map of function names to their definitions
    subgraphIds: {}, // Map of function names to their subgraph IDs
    visited: new Set(), // Set to track visited AST nodes to prevent duplicate processing
    
    next() {
      return `N${state.nodeId++}`;
    },

    nextSubgraphId() {
      return `SG${state.subgraphId++}`;
    },
    
    add(id, label) {
      this.nodes.push(`${id}${label}`);
    },
    
    addEdge(from, to, label = null) {
      if (!from || !to) return;
      
      const edge = label ? `${from} -- ${label} --> ${to}` : `${from} --> ${to}`;
      
      // For 'No' labeled edges, check if this 'from' node already has a 'No' edge
      // to prevent duplicate No branches in if-else-if chains
      if (label === 'No') {
        const existingNoEdge = this.edges.find(e => e.startsWith(`${from} -- No -->`));
        if (existingNoEdge) {
          // If there's already a 'No' edge from this node, don't add another
          return;
        }
      }
      
      this.edges.push(edge);
    },
    
    setLast(id) {
      this.last = id;
    },

    fork() {
      const newCtx = ctx(state);
      // Copy the visited set to the new context
      newCtx.visited = new Set(this.visited);
      return newCtx;
    },

    addRaw(line) {
      this.nodes.push(line);
    },

    addSubgraph(label, lines = []) {
      this.nodes.push(`subgraph ${label}`);
      lines.forEach(line => this.nodes.push(`  ${line}`));
      this.nodes.push('end');
    },

    completeBranches() {
      // Placeholder for legacy calls. Branch handling now occurs via join queue.
    },

    // Add function to create connections between function calls and definitions
    createFunctionConnections() {
      // First handle explicitly stored function calls
      if (this.functionCalls && this.subgraphIds) {
        this.functionCalls.forEach(callInfo => {
          const functionName = callInfo.functionName;
          const callId = callInfo.callId;
          
          if (this.subgraphIds[functionName]) {
            const subgraphId = this.subgraphIds[functionName];
            // Add a bidirectional connection from the function call to the subgraph
            this.edges.push(`${callId} <--> ${subgraphId}`);
          }
        });
      }
      
      // Then scan through all nodes to find function calls in node texts
      // Only create connections if they don't already exist to avoid duplicates
      if (this.subgraphIds && this.nodes) {
        // Create a set of existing function connections to avoid duplicates
        const existingConnections = new Set();
        this.edges.forEach(edge => {
          if (edge.includes(' <--> SG')) { // Look for function connections
            existingConnections.add(edge);
          }
        });
        
        // Create a map of function names to subgraph IDs for quick lookup
        const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
        
        this.nodes.forEach(nodeLine => {
          // Check if this is a regular node (not a subgraph declaration)
          if (nodeLine.startsWith('N') && !nodeLine.startsWith('subgraph')) {
            // Extract the node ID (e.g., N5)
            const nodeIdMatch = nodeLine.match(/^N\d+/);
            if (nodeIdMatch) {
              const nodeId = nodeIdMatch[0];
              
              // Look for function calls in the node text
              const nodeText = nodeLine.substring(nodeId.length);
              let match;
              while ((match = functionRegex.exec(nodeText)) !== null) {
                const functionName = match[1];
                
                // Skip common Java methods that are not user-defined
                if (['if', 'for', 'while', 'switch', 'return', 'break', 'continue', 'System'].includes(functionName)) {
                  continue;
                }
                
                // Check if this is a user-defined function
                if (this.subgraphIds[functionName]) {
                  const subgraphId = this.subgraphIds[functionName];
                  const newEdge = `${nodeId} <--> ${subgraphId}`;
                  
                  // Only add the connection if it doesn't already exist
                  if (!existingConnections.has(newEdge)) {
                    this.edges.push(newEdge);
                    existingConnections.add(newEdge);
                  }
                }
              }
            }
          }
        });
      }
    },
    
    // --- If handling helpers ------------------------------------------------
    registerIf(conditionId, hasElse) {
      const frame = {
        conditionId,
        hasElse,
        then: { started: false, last: null },
        else: { started: false, last: null },
        activeBranch: null
      };
      this.ifStack.push(frame);
      return frame;
    },

    currentIf() {
      return this.ifStack[this.ifStack.length - 1] || null;
    },

    enterBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      frame.activeBranch = type === 'else' ? 'else' : 'then';
    },

    exitBranch(type) {
      const frame = this.currentIf();
      if (!frame) return;
      if (frame.activeBranch === type) {
        frame.activeBranch = null;
      }
    },

    handleBranchConnection(nodeId, { skipEdge = false } = {}) {
      const frame = this.currentIf();
      if (!frame || !frame.activeBranch) return false;

      const branchInfo = frame[frame.activeBranch];
      if (!skipEdge) {
        if (!branchInfo.started) {
          const label = frame.activeBranch === 'then' ? 'Yes' : 'No';
          this.addEdge(frame.conditionId, nodeId, label);
        } else if (branchInfo.last) {
          this.addEdge(branchInfo.last, nodeId);
        }
      }

      branchInfo.started = true;
      branchInfo.last = nodeId;
      this.last = nodeId;
      return true;
    },

    completeIf() {
      const frame = this.ifStack.pop();
      if (!frame) return null;
      
      this.queueJoinForFrame(frame);
      
      // Check if this if was inside a parent if's branch
      const parentFrame = this.currentIf();
      if (parentFrame && parentFrame.activeBranch) {
        const parentBranch = parentFrame[parentFrame.activeBranch];
        // If the parent branch's last node is this if's condition,
        // it means this if was the first statement in the parent's branch.
        // Update the parent branch to have no single last node since joins are queued.
        if (parentBranch.last === frame.conditionId) {
          parentBranch.last = null;
        }
      }
      
      // Don't leave ctx.last pointing to this if's condition node
      // because that would cause the parent to think the branch ends at the condition
      // Instead, set it to null to indicate no single last node (joins are queued)
      this.last = null;
      
      return frame;
    },

    queueJoinForFrame(frame) {
      const edges = [];

      if (frame.then.last) {
        edges.push({ from: frame.then.last, label: null });
      } else {
        edges.push({ from: frame.conditionId, label: 'Yes' });
      }

      if (frame.hasElse) {
        if (frame.else.last) {
          edges.push({ from: frame.else.last, label: null });
        } else if (frame.else.started) {
          // Else branch was started but has no last node.
          // This means it contains only control flow structures (nested ifs)
          // that have queued their own joins. Don't add an edge from condition.
          // However, for if-else-if chains, we need to connect the No branch
          // directly to the next condition.
          // We'll handle this in the finalize function by checking if the next
          // node after this frame's condition is another if statement.
        } else {
          // Else branch was never started (empty), edge from condition
          edges.push({ from: frame.conditionId, label: 'No' });
        }
      } else {
        edges.push({ from: frame.conditionId, label: 'No' });
      }

      this.pendingJoins.push({ edges });
    },

    resolvePendingJoins(targetId) {
      if (!this.pendingJoins || this.pendingJoins.length === 0) return false;
      const joins = this.pendingJoins.splice(0);
      joins.forEach(join => {
        join.edges.forEach(({ from, label }) => {
          if (!from) return;
          if (label) {
            this.addEdge(from, targetId, label);
          } else {
            this.addEdge(from, targetId);
          }
        });
      });
      return joins.length > 0;
    },

    completeSwitch() {
      console.log('completeSwitch called');
      console.log('  switchEndNodes:', JSON.stringify(this.switchEndNodes, null, 2));
      console.log('  switchEndNodes length:', this.switchEndNodes?.length);
      
      // Collect all edges that should connect to the next statement after switch
      const edges = [];
      
      // Current switch level is the length of switchEndNodes array minus 1
      // (since we push a placeholder when entering switch)
      const currentSwitchLevel = (this.switchEndNodes?.length || 1) - 1;
      console.log('  currentSwitchLevel:', currentSwitchLevel);
      console.log('  pendingBreaks before:', JSON.stringify(this.pendingBreaks, null, 2));
      
      // Track break IDs for this switch level to avoid duplicate connections
      const currentSwitchBreakIds = new Set();
      
      // Add pending breaks from this switch level
      if (this.pendingBreaks && this.pendingBreaks.length > 0) {
        const switchBreaks = this.pendingBreaks.filter(
          b => b.switchLevel === currentSwitchLevel
        );
        console.log('  switchBreaks found:', switchBreaks.length);
        
        // Record break IDs for this switch level
        switchBreaks.forEach(b => currentSwitchBreakIds.add(b.breakId));
        
        // Remove processed breaks
        this.pendingBreaks = this.pendingBreaks.filter(
          b => b.switchLevel !== currentSwitchLevel
        );
        
        // Add break edges
        switchBreaks.forEach(b => {
          edges.push({ from: b.breakId, label: null });
        });
      } else {
        console.log('  No pending breaks or pendingBreaks is null');
      }
      
      // Add the last node if it exists and is not already a break statement
      // (default case without break, or last case without break)
      if (this.last && !currentSwitchBreakIds.has(this.last)) {
        edges.push({ from: this.last, label: null });
      }
      
      // Queue all edges as pending joins
      if (edges.length > 0) {
        this.pendingJoins.push({ edges });
      }
      
      console.log('  edges queued:', edges.length);
      console.log('  pendingBreaks after:', JSON.stringify(this.pendingBreaks, null, 2));
      console.log('  pendingJoins after:', JSON.stringify(this.pendingJoins, null, 2));
      
      // Pop the switch end node placeholder
      if (this.switchEndNodes && this.switchEndNodes.length > 0) {
        this.switchEndNodes.pop();
      }
      
      // Clear the current switch ID but preserve last pointer for proper flow
      this.currentSwitchId = null;
      // Don't clear this.last - it's needed for connecting to next statement
    },
    
    completeLoop() {
      // Connect the end of the loop body back to the loop condition (this represents the update step for for loops and condition re-check for while loops)
      // Get the most recent pending loop
      if (this.pendingLoops && this.pendingLoops.length > 0) {
        const loopInfo = this.pendingLoops[this.pendingLoops.length - 1];
        
        if (loopInfo.type === 'do-while') {
          // For do-while loops: connect end of body back to condition, 
          // and condition has Yes/No branches
          if (this.last && loopInfo.loopId) {
            // Connect the last processed node (end of loop body) back to the loop condition
            this.addEdge(this.last, loopInfo.loopId);
            
            // Set up the condition node with Yes/No branches
            // Yes branch goes back to first body statement
            if (this.doWhileFirstBodyNodeId) {
              this.addEdge(loopInfo.loopId, this.doWhileFirstBodyNodeId, 'Yes');
            }
            // No branch will be handled by the normal flow (next statement after loop)
            // which is already set by this.last = loopInfo.loopId
          }
        } else {
          // For for and while loops: connect end of body back to condition
          if (this.last && loopInfo.loopId) {
            // Connect the last processed node (end of loop body) back to the loop condition
            // This connection should not have a label as it represents the loop continuation
            this.addEdge(this.last, loopInfo.loopId);
          }
        }
        
        // Update the last pointer to the loop condition node
        // This ensures that the next statement connects from the loop as a whole
        this.last = loopInfo.loopId;
        
        // Remove the processed loop
        this.pendingLoops.pop();
      }
      
      // Clear loop-specific context
      this.inLoop = false;
      this.loopContinueNode = null;
      this.currentLoop = null;
    },
    
    emit() {
      // Create function connections before emitting
      this.createFunctionConnections();
      
      return [
        'flowchart TD',
        ...this.nodes,
        ...this.edges
      ].join('\n');
    }
  };
  
  return context;
}