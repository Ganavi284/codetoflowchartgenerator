import { process } from "../../pascal/mappings/common/common.mjs";
import { linkNext } from "../../pascal/mappings/common/common.mjs";

export function mapAssign(node, ctx) {
  // If we're in a loop, defer this statement until after control flow convergence
  if (ctx.inLoop && ctx.deferredStatements) {
    ctx.deferredStatements.push({
      type: 'assign',
      node: node,
      text: node.text
    });
    return;
  }
  
  const id = ctx.next();
  ctx.add(id, process(node.text));
  
  // Connect to previous node and set as last
  linkNext(ctx, id);
  
  // If this assignment contains function calls, store them for later connection
  if (node.functionCalls && Array.isArray(node.functionCalls)) {
    node.functionCalls.forEach(funcName => {
      if (!ctx.functionCalls) {
        ctx.functionCalls = [];
      }
      ctx.functionCalls.push({
        callId: id,
        functionName: funcName
      });
    });
  }
}