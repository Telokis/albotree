import { GetEntitiesFilters, Tools } from "alclient";
import { BTNode } from "../BehaviorTree/BTNode";
import { Blackboard, BlackboardMarkedKey } from "../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../BehaviorTree/BTNodeStatus";

export interface AcquireTargetsProps {
  criteria: GetEntitiesFilters;
  BBKey?: BlackboardMarkedKey;
}

export class AcquireTargets extends BTNode {
  criteria: GetEntitiesFilters;

  BBKey: BlackboardMarkedKey;

  constructor({ criteria, BBKey = "key:targets" }: AcquireTargetsProps) {
    super();

    this.criteria = criteria;
    this.BBKey = BBKey;

    this.debug(
      `Created AcquireTargets node with criteria: ${JSON.stringify(
        this.criteria,
      )} and BBKey: ${this.BBKey}`,
    );
  }

  override getNodeType(): string {
    return "AcquireTargets";
  }

  override getComment(): string {
    return `${JSON.stringify(this.criteria, null, 2)} => ${this.BBKey}`;
  }

  override tick(blackboard: Blackboard): BTNodeStatus {
    const bot = blackboard.character;
    const entities = blackboard.character
      .getEntities(this.criteria)
      .sort((a, b) => Tools.squaredDistance(bot, a) - Tools.squaredDistance(bot, b));

    this.debug(`Acquired ${entities.length} targets.`);

    blackboard.set(this.BBKey, entities);

    return BTNodeStatus.Success;
  }
}
