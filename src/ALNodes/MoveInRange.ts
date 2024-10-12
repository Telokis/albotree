import { Entity } from "alclient";
import { Blackboard, BlackboardMarkedKey } from "../core/Blackboard";
import { BTNodeStatus } from "../core/BTNodeStatus";
import { AsyncNode } from "../core/nodes/AsyncNode";

const RANGE_OFFSET = -25;

export interface MoveInRangeProps {
    BBKey: BlackboardMarkedKey;
}

export class MoveInRange extends AsyncNode {
    BBKey: BlackboardMarkedKey;

    constructor({ BBKey }: MoveInRangeProps) {
        super();
        this.BBKey = BBKey;
    }

    /**
     * Gets the type of the behavior tree node.
     * @returns The type of the behavior tree node.
     */
    override getNodeType(): string {
        return "MoveInRange";
    }

    override getComment(): string {
        return this.BBKey;
    }

    override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
        const targets = blackboard.get<Entity[]>(this.BBKey);

        if (!targets || targets.length === 0) {
            this.debug("MoveInRange: no targets found in blackboard", this.BBKey);
            return BTNodeStatus.Failure;
        }

        // Go in range of the target
        await blackboard.character.smartMove(targets[0], {
            getWithin: blackboard.character.range + RANGE_OFFSET,
        });

        return BTNodeStatus.Success;
    }
}
