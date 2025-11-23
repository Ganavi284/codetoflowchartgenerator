/**
 * Mapping context type definitions
 */

export class MappingContext {
  constructor(language, options = {}) {
    this.language = language;
    this.options = options;
    this.nodeMap = new Map();
  }
}