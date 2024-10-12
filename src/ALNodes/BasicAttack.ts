import { Entity } from "alclient";
import { Blackboard, BlackboardMarkedKey } from "../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../BehaviorTree/BTNodeStatus";
import { AsyncNode } from "../BehaviorTree/nodes/AsyncNode";

export interface BasicAttackProps {
  BBKey?: BlackboardMarkedKey;
  randomize?: boolean;
}

export class BasicAttack extends AsyncNode {
  BBKey: BlackboardMarkedKey;

  randomize: boolean;

  constructor({ BBKey = "key:targets", randomize = false }: BasicAttackProps) {
    super();

    this.BBKey = BBKey;
    this.randomize = randomize;
  }

  override getNodeType(): string {
    return "BasicAttack";
  }

  override getComment(): string {
    return this.BBKey;
  }

  override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
    const targets = blackboard.get<Entity[]>(this.BBKey);

    if (!targets || targets.length === 0) {
      console.error("BasicAttack: no targets found in blackboard", this.BBKey);
      return BTNodeStatus.Failure;
    }

    const chosen = this.randomize
      ? targets[Math.floor(Math.random() * targets.length)]
      : targets[0];

    const result = await blackboard.character.basicAttack(chosen.id);

    if (result.failed) {
      console.error("BasicAttack: failed to attack", result.reason);
      console.error(result);
      return BTNodeStatus.Failure;
    }

    this.debug("BasicAttack: attacked target", chosen.id);

    return BTNodeStatus.Success;
  }
}
