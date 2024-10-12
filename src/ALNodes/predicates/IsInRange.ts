import { Entity, Tools } from "alclient";
import { BTNode } from "../../BehaviorTree/BTNode";
import { Blackboard, BlackboardMarkedKey } from "../../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../../BehaviorTree/BTNodeStatus";

export interface IsInRangeProps {
  BBKey?: BlackboardMarkedKey;
}

export class IsInRange extends BTNode {
  BBKey: BlackboardMarkedKey;

  constructor({ BBKey = "key:targets" }: IsInRangeProps) {
    super();
    this.BBKey = BBKey;
  }

  override getNodeType(): string {
    return "IsInRange";
  }

  override getComment(): string {
    return this.BBKey;
  }

  override tick(blackboard: Blackboard): BTNodeStatus {
    const targets = blackboard.get<Array<Entity>>(this.BBKey);

    if (!targets || targets.length === 0) {
      this.debug("No targets found in blackboard", this.BBKey);
      return BTNodeStatus.Failure;
    }

    const bot = blackboard.character;
    const entities = targets.filter(
      (entity) => Tools.squaredDistance(bot, entity) < bot.range * bot.range,
    );

    this.debug("Found", entities.length, "entities in range out of", targets.length, "candidates");

    return entities.length > 0 ? BTNodeStatus.Success : BTNodeStatus.Failure;
  }
}
