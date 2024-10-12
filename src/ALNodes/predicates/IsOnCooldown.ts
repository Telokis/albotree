import { SkillName } from "alclient";
import { BTNode } from "../../BehaviorTree/BTNode";
import { Blackboard } from "../../BehaviorTree/Blackboard";
import { BTNodeStatus } from "../../BehaviorTree/BTNodeStatus";

export interface IsOnCooldownProps {
  spellName: SkillName;
}

export class IsOnCooldown extends BTNode {
  spellName: SkillName;

  constructor({ spellName }: IsOnCooldownProps) {
    super();
    this.spellName = spellName;
  }

  override getNodeType(): string {
    return "IsOnCooldown";
  }

  override getComment(): string {
    return this.spellName;
  }

  override tick(blackboard: Blackboard): BTNodeStatus {
    if (blackboard.character.isOnCooldown(this.spellName)) {
      this.debug(`Spell ${this.spellName} is on cooldown`);
      return BTNodeStatus.Success;
    }

    this.debug(`Spell ${this.spellName} is NOT on cooldown`);
    return BTNodeStatus.Failure;
  }
}
