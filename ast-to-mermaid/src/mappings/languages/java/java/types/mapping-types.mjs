/**
 * Mapping type definitions
 */

export class MappedNode {
  constructor(id, type, properties = {}) {
    this.id = id;
    this.type = type;
    Object.assign(this, properties);
  }
}