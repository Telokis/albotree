import { Blackboard } from "../core/Blackboard";
import { BTNodeStatus } from "../core/BTNodeStatus";
import { AsyncNode } from "../core/nodes/AsyncNode";

export class DrinkPotion extends AsyncNode {
    override getNodeType(): string {
        return "DrinkPotion";
    }

    override getComment(): string {
        return "";
    }

    override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
        const { character } = blackboard;

        const missingHp = character.max_hp - character.hp;
        const missingMp = character.max_mp - character.mp;

        const percentHp = character.hp / character.max_hp;
        const percentMp = character.mp / character.max_mp;

        const priestInParty =
            character.party &&
            Object.values(character.partyData.party).some((e) => e.type === "priest");

        const hp_value =
            character.countItem("hpot0") > 0 ? 200 : character.countItem("hpot1") > 0 ? 400 : 50;
        const mp_value =
            character.countItem("mpot0") > 0 ? 300 : character.countItem("mpot1") > 0 ? 500 : 50;

        // Priests should not use healing potions before mana potions.
        if (character.ctype !== "priest" || percentMp > 0.75) {
            // If we have a priest, we only heal below 40% hp
            if (priestInParty && character.ctype !== "priest") {
                if (percentHp < 0.4) {
                    this.debug("Using HP potion, case 1");
                    return await this.usePotion(blackboard, "hp");
                }
            } else {
                if (percentHp < 0.5) {
                    this.debug("Using HP potion, case 2");
                    return await this.usePotion(blackboard, "hp");
                }
                if (missingHp >= hp_value) {
                    this.debug("Using HP potion, case 3");
                    return await this.usePotion(blackboard, "hp");
                }
            }
        }

        if (percentMp < 0.2) {
            this.debug("Using MP potion, case 1");
            return await this.usePotion(blackboard, "mp");
        }
        if (missingMp >= mp_value) {
            this.debug("Using MP potion, case 2");
            return await this.usePotion(blackboard, "mp");
        }

        this.debug("No potions needed");
        return BTNodeStatus.Success;
    }

    async usePotion(blackboard: Blackboard, potion: "hp" | "mp") {
        const { character } = blackboard;

        if (potion === "hp") {
            if (character.countItem("hpot1") > 0) {
                this.debug("Using hpot1");
                await character.usePotion(
                    character.locateItem("hpot1", character.items, {
                        returnLowestQuantity: true,
                    }),
                );
                return BTNodeStatus.Success;
            }
            if (character.countItem("hpot0") > 0) {
                this.debug("Using hpot0");
                await character.usePotion(
                    character.locateItem("hpot0", character.items, {
                        returnLowestQuantity: true,
                    }),
                );
                return BTNodeStatus.Success;
            }
        } else {
            if (character.countItem("mpot1") > 0) {
                this.debug("Using mpot1");
                await character.usePotion(
                    character.locateItem("mpot1", character.items, {
                        returnLowestQuantity: true,
                    }),
                );
                return BTNodeStatus.Success;
            }
            if (character.countItem("mpot0") > 0) {
                this.debug("Using mpot0");
                await character.usePotion(
                    character.locateItem("mpot0", character.items, {
                        returnLowestQuantity: true,
                    }),
                );
                return BTNodeStatus.Success;
            }
        }

        return BTNodeStatus.Failure;
    }
}
