import { ItemName } from "alclient";
import { BTNode } from "../../core/BTNode";
import { Blackboard } from "../../core/Blackboard";
import { BTNodeStatus } from "../../core/BTNodeStatus";

export class HasPotions extends BTNode {
    private static MP_POTIONS: ItemName[] = ["mpot0", "mpot1"];

    private static HP_POTIONS: ItemName[] = ["hpot0", "hpot1"];

    constructor() {
        super();
    }

    override getNodeType(): string {
        return "HasPotions";
    }

    override getComment(): string {
        return "";
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        const enoughMP = this.hasOneOfPotions(blackboard, HasPotions.MP_POTIONS);
        const enoughHP = this.hasOneOfPotions(blackboard, HasPotions.HP_POTIONS);

        if (!enoughMP) {
            this.debug("Not enough MP potions");
            return BTNodeStatus.Failure;
        }

        if (!enoughHP) {
            this.debug("Not enough HP potions");
            return BTNodeStatus.Failure;
        }

        return BTNodeStatus.Success;
    }

    hasOneOfPotions(blackboard: Blackboard, potions: ItemName[]): boolean {
        return potions.some((potion) => blackboard.character.countItem(potion) > 0);
    }
}
