import { BTNode } from "../../BehaviorTree/BTNode";
import { Blackboard } from "../../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../../BehaviorTree/BTNodeStatus";

/**
 * Represents a behavior tree node that checks if the current character is alive.
 */
export class IsAlive extends BTNode {
  /**
   * Gets the type of the behavior tree node.
   * @returns {string} The type of the behavior tree node.
   */
  override getNodeType(): string {
    return "IsAlive";
  }

  /**
   * Gets the comment for the behavior tree node.
   * @returns {string} The comment for the behavior tree node.
   */
  override getComment(): string {
    return "";
  }

  /**
   * Checks if the current character is alive. Relies on the character's rip property.
   * @param {Blackboard} blackboard - The blackboard object containing the game state.
   * @returns {BTNodeStatus} The status of the behavior tree node after execution.
   */
  override tick(blackboard: Blackboard): BTNodeStatus {
    this.debug("Is the character alive?", !blackboard.character.rip);
    return blackboard.character.rip ? BTNodeStatus.Failure : BTNodeStatus.Success;
  }
}
