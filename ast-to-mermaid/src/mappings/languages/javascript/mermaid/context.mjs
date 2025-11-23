/**
 * Dynamic node/edge registry for Mermaid flowchart generation
 * Manages node IDs, connections, and flowchart structure
 */
import { shapes } from "./shapes.mjs";

let nodeIdCounter = 1;

export function ctx() {
  nodeIdCounter = 1;

  return {
    nodes: [],
    nodeOrder: [],
    edges: [],
    last: null,
    lastNodeId: null,
    ifStack: [], // Add ifStack for branch handling
    pendingJoins: [], // Add pendingJoins for branch merging
    switchEndNodes: [], // Add switchEndNodes for switch statement handling
    pendingBreaks: [], // Add pendingBreaks for break statement handling
    currentSwitchId: null, // Add currentSwitchId for switch statement handling
    
    // Generate next unique node ID
    nextId() {
      return `N${nodeIdCounter++}`;
    },

    // Legacy alias used throughout the language mappers
    next() {
      return this.nextId();
    },
    
    // Add a node to the flowchart
    addNode(id, shape) {
      if (!id || !shape) return;
      this.nodes.push(`${id}${shape}`);
      this.nodeOrder.push(id);
      this.lastNodeId = id;
    },

    // Legacy alias
    add(id, shape) {
      this.addNode(id, shape);
    },
    
    // Add an edge between nodes
    addEdge(fromId, toId, label = null) {
      if (!fromId || !toId) return;
      if (label) {
        this.edges.push(`${fromId} -->|${label}| ${toId}`);
      } else {
        this.edges.push(`${fromId} --> ${toId}`);
      }
    },

    // Set the last node ID
    setLast(id) {
      this.last = id;
    },

    // Get the last node ID
    getLast() {
      return this.last ?? this.lastNodeId ?? null;
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
    
    // Complete a switch statement by connecting all case branches
    completeSwitch() {
      // Find the next statement after the switch block
      let nextStatementId = 'END';
      
      if (this.nodes && this.nodeOrder.length > 0) {
        // Find the switch node
        const switchNode = this.nodes.find(node => node.includes('switch'));
        if (switchNode) {
          const switchIdMatch = switchNode.match(/^(N\d+)/);
          if (switchIdMatch) {
            const switchId = switchIdMatch[1];
            const switchIndex = this.nodeOrder.indexOf(switchId);
            
            if (switchIndex !== -1) {
              // Find the first statement after the switch block
              for (let i = switchIndex + 1; i < this.nodeOrder.length; i++) {
                const nodeId = this.nodeOrder[i];
                const node = this.nodes.find(n => n.startsWith(nodeId));
                if (node) {
                  // Check if this node is part of the switch
                  const isSwitchRelated = 
                    node.includes('case ') || 
                    node.includes('default:') ||
                    node.includes('switch') ||
                    node.includes('break;');
                  
                  if (!isSwitchRelated) {
                    nextStatementId = nodeId;
                    break;
                  }
                }
              }
            }
          }
        }
      }
      
      // Current switch level is the length of switchEndNodes array minus 1
      // (since we push a placeholder when entering switch)
      const currentSwitchLevel = (this.switchEndNodes?.length || 1) - 1;
      
      // Connect pending breaks directly to the next statement after switch
      if (this.pendingBreaks && this.pendingBreaks.length > 0) {
        const switchBreaks = this.pendingBreaks.filter(
          b => b.switchLevel === currentSwitchLevel
        );
        
        // Connect break statements directly to the next statement after switch
        switchBreaks.forEach(b => {
          this.addEdge(b.breakId, nextStatementId);
        });
        
        // Remove processed breaks
        this.pendingBreaks = this.pendingBreaks.filter(
          b => b.switchLevel !== currentSwitchLevel
        );
      }
      
      // Handle case connections and fall-through behavior
      if (this.switchCaseNodes && this.switchCaseNodes.length > 0) {
        // Process each case to handle fall-through behavior
        for (let i = 0; i < this.switchCaseNodes.length; i++) {
          const caseInfo = this.switchCaseNodes[i];
          const caseId = caseInfo.id;
          
          // Find the case node in nodeOrder
          const caseIndex = this.nodeOrder.indexOf(caseId);
          if (caseIndex === -1) continue;
          
          // Find the next case or the end of switch block
          let nextRelevantIndex = this.nodeOrder.length;
          if (i < this.switchCaseNodes.length - 1) {
            // Not the last case, find the next case
            const nextCaseInfo = this.switchCaseNodes[i + 1];
            const nextCaseIndex = this.nodeOrder.indexOf(nextCaseInfo.id);
            if (nextCaseIndex !== -1) {
              nextRelevantIndex = nextCaseIndex;
            }
          } else {
            // Last case, next relevant point is after switch block
            nextRelevantIndex = this.nodeOrder.length;
          }
          
          // Check if there's a break statement between this case and the next relevant point
          let hasBreakBetween = false;
          let lastStatementInCase = caseId;
          
          for (let j = caseIndex + 1; j < nextRelevantIndex && j < this.nodeOrder.length; j++) {
            const nodeId = this.nodeOrder[j];
            const node = this.nodes.find(n => n.startsWith(nodeId));
            if (node) {
              if (node.includes('break;')) {
                hasBreakBetween = true;
                // Break statements are already connected in the pendingBreaks section above
              } else if (node.includes('case ') || node.includes('default:') || node.includes('switch')) {
                // Reached another case or switch, stop processing this case
                break;
              } else {
                // Regular statement in case
                lastStatementInCase = nodeId;
              }
            }
          }
          
          // If no break between cases, connect for fall-through
          if (!hasBreakBetween && i < this.switchCaseNodes.length - 1) {
            const nextCaseInfo = this.switchCaseNodes[i + 1];
            this.addEdge(lastStatementInCase, nextCaseInfo.id);
          } else if (!hasBreakBetween && i === this.switchCaseNodes.length - 1) {
            // Last case without break should connect to next statement after switch
            this.addEdge(lastStatementInCase, nextStatementId);
          }
        }
      } else if (this.currentSwitchId) {
        // If there are no cases, connect the switch node directly to the next statement
        this.addEdge(this.currentSwitchId, nextStatementId);
      }
      
      // Set the next statement as the last node for subsequent connections
      this.last = nextStatementId === 'END' ? null : nextStatementId;
      
      // Pop the switch end node placeholder
      if (this.switchEndNodes && this.switchEndNodes.length > 0) {
        this.switchEndNodes.pop();
      }
      
      // Clear switch-specific context
      this.currentSwitchId = null;
      this.switchCaseNodes = null;
      this.switchMergeNode = null;
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
    
    // Helper function to check if there are more statements after the current if
    hasMoreStatementsAfterIf() {
      // This is a simplified check - in a real implementation, we would need to
      // analyze the AST to see if there are more statements after the current if block
      // For now, we'll return true to always queue joins for later processing
      return true;
    },
    
    // Generate complete Mermaid flowchart
    emit() {
      // Handle empty flowcharts
      if (this.nodes.length === 0) {
        return [
          'flowchart TD',
          '  START(["start"])',
          '  END(["end"])',
          '  START --> END'
        ].join('\n');
      }

      // Build the flowchart
      const lines = ['flowchart TD'];
      
      // Add start node
      lines.push('  START(["start"])');
      
      // Add all nodes
      this.nodes.forEach(node => {
        lines.push(`  ${node}`);
      });
      
      // Add end node
      lines.push('  END(["end"])');
      
      // Add edges
      if (this.nodeOrder.length > 0) {
        // Connect start to first node
        lines.push(`  START --> ${this.nodeOrder[0]}`);
        
        // Add all registered edges
        this.edges.forEach(edge => {
          lines.push(`  ${edge}`);
        });
      } else {
        // If no nodes were added, connect start directly to end
        lines.push('  START --> END');
      }
      
      return lines.join('\n');
    }
  };
}