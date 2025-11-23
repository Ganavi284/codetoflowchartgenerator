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
    currentSwitchId: null,
    inLoop: false,
    loopContinueNode: null,
    deferredStatements: [],
    ifStack: [],
    pendingJoins: []
  };
  
  return context;
}