import { BTNode } from "../../BTNode";
import { BTNodeStatus } from "../../BTNodeStatus";
import { Blackboard } from "../../Blackboard";

export interface NotDecoratorProps {
  /**
   * The child node to be negated.
   */
  children: BTNode;
}

/**
 * Represents a decorator node that inverts the result of its child node.
 *
 * In a behavior tree, the NotDecorator inverts the status of its child node:
 * - Success becomes Failure
 * - Failure becomes Success
 * - Running remains unchanged
 */
export class NotDecorator extends BTNode {
  /**
   * The child node whose result will be inverted.
   */
  private child: BTNode;

  /**
   * Constructs a new NotDecorator instance.
   *
   * @param child - The child node to be decorated.
   */
  constructor({ children }: NotDecoratorProps) {
    super();
    this.child = children;
  }

  /**
   * Gets the type of the node.
   *
   * @returns The type of the node as a string in the format "Not(childNodeType)".
   */
  override getNodeType(): string {
    return `Not(${this.child.getNodeType()})`;
  }

  /**
   * Gets the comment of the node.
   *
   * @returns The comment of the node as a string in the format "Not(childNodeComment)".
   */
  override getComment(): string {
    return `Not(${this.child.getComment()})`;
  }

  /**
   * Executes the tick operation on the node.
   *
   * This method is called by the behavior tree to update the status of the node.
   * It inverts the result of the child node:
   * - Success becomes Failure
   * - Failure becomes Success
   * - Running remains unchanged
   *
   * @param blackboard - The blackboard object used to store and retrieve data during the behavior tree execution.
   * @returns The inverted status of the child node after the tick operation.
   */
  override tick(blackboard: Blackboard): BTNodeStatus {
    const status = this.child.tick(blackboard);

    switch (status) {
      case BTNodeStatus.Success:
        return BTNodeStatus.Failure;
      case BTNodeStatus.Failure:
        return BTNodeStatus.Success;
      default:
        return status; // Running status remains unchanged
    }
  }
}

/**
 * Creates a NotDecorator node that inverts the result of the given node.
 *
 * @param node - The node to be decorated.
 * @returns A new NotDecorator instance that inverts the result of the given node.
 */
export function Not(node: BTNode): BTNode {
  return new NotDecorator({ children: node });
}
