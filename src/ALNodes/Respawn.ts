import { Blackboard } from "../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../BehaviorTree/BTNodeStatus";
import { AsyncNode } from "../BehaviorTree/nodes/AsyncNode";

export class Respawn extends AsyncNode {
  override getNodeType(): string {
    return "Respawn";
  }

  override getComment(): string {
    return "";
  }

  override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
    await blackboard.character.respawn();

    return BTNodeStatus.Success;
  }
}
