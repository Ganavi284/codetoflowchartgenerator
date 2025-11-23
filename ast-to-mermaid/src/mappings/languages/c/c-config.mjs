import { extractC } from "../../../extractors/c-extractor.mjs";
import { normalizeC } from "../../../normalizer/normalize-c.mjs";
import { mapNodeC } from "./c.mjs";

/**
 * C language configuration for dynamic flowchart generation
 * Registers the C language processing pipeline
 */
export const cConfig = {
  id: "c",
  name: "C Language",
  extractor: extractC,
  normalizer: normalizeC,
  mapper: mapNodeC
};