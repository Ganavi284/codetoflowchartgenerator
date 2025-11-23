/**
 * AST type definitions
 */

export class ASTNode {
  constructor(type, properties = {}) {
    this.type = type;
    Object.assign(this, properties);
  }
}