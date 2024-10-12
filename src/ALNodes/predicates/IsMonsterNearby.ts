import { MonsterName } from "alclient";
import { BTNode } from "../../core/BTNode";
import { Blackboard, BlackboardMarkedKey } from "../../core/Blackboard";
import { BTNodeStatus } from "../../core/BTNodeStatus";

type MobTypeOrKey = MonsterName | BlackboardMarkedKey;

export interface IsMonsterNearbyProps {
    mobTypes: MobTypeOrKey | Array<MobTypeOrKey>;
}

/**
 * Represents a behavior tree node that checks if there is a monster nearby.
 * This node can check for specific monster types or types stored in the blackboard.
 */
export class IsMonsterNearby extends BTNode {
    /**
     * The types of monsters to check for. Can be direct types or keys to look up in the blackboard.
     */
    mobTypes: Array<MobTypeOrKey>;

    /**
     * Creates a new instance of the IsMonsterNearby class.
     * @param mobTypes - The types of monsters to check for, either directly or as keys in the blackboard.
     */
    constructor({ mobTypes }: IsMonsterNearbyProps) {
        super();
        this.mobTypes = Array.isArray(mobTypes) ? mobTypes : [mobTypes];
    }

    /**
     * Gets the type of the behavior tree node.
     * @returns The type of the behavior tree node.
     */
    override getNodeType(): string {
        return "IsMonsterNearby";
    }

    /**
     * Lists the types of monsters to check for in the comment.
     * @returns The comment for the behavior tree node.
     */
    override getComment(): string {
        return this.mobTypes.join(", ");
    }

    /**
     * Executes the behavior tree node.
     * Will return Success if there is a monster nearby that matches the specified types, otherwise Failure.
     * @param blackboard - The blackboard object used to store and retrieve data during the behavior tree execution.
     * @returns The status of the behavior tree node.
     */
    override tick(blackboard: Blackboard): BTNodeStatus {
        const realMobTypes = this.mobTypes
            .flatMap((mobType) => {
                if (mobType.startsWith("key:")) {
                    return blackboard.get<MonsterName | Array<MonsterName>>(mobType);
                }

                return mobType as MonsterName;
            })
            .filter((m) => typeof m === "string");

        this.debug(
            "Checking for monsters of types",
            realMobTypes.join(", "),
            "filter was",
            this.mobTypes.join(", "),
        );

        const entities = blackboard.character.getEntities({ typeList: realMobTypes });

        this.debug("Found", entities.length, "entities nearby.");

        return entities.length > 0 ? BTNodeStatus.Success : BTNodeStatus.Failure;
    }
}
