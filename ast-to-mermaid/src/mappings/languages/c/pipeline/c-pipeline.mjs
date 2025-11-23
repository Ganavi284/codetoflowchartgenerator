import { extractC } from "../extractors/c-extractor.mjs";
import { normalizeC } from "../normalizer/normalize-c.mjs";
import { walk } from "../walkers/walk.mjs";
import { ctx } from "../mermaid/context.mjs";
import { mapNodeC } from "../map-node-c.mjs";

export function generateFlowchartFromC(code) {
  const ast = extractC(code);
  const norm = normalizeC(ast);

  const context = ctx();
  context.handle = (node) => mapNodeC(node, context);

  walk(norm, context);

  return context.emit();
}