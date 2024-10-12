import { Blackboard } from "../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../BehaviorTree/BTNodeStatus";
import { AsyncNode } from "../BehaviorTree/nodes/AsyncNode";

export class LootChests extends AsyncNode {
  override getNodeType(): string {
    return "LootChests";
  }

  override getComment(): string {
    return "";
  }

  override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
    const { character } = blackboard;

    for (const [, chest] of character.chests) {
      this.debug("Opening chest", chest.id);
      await character.openChest(chest.id);
    }

    return BTNodeStatus.Success;
  }
}
