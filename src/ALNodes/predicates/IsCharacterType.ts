import { CharacterType } from "alclient";
import { BTNode } from "../../core/BTNode";
import { Blackboard } from "../../core/Blackboard";
import { BTNodeStatus } from "../../core/BTNodeStatus";

export interface IsCharacterTypeProps {
    ctype: CharacterType;
}

/**
 * Represents a behavior tree node that checks if the current character is alive.
 */
export class IsCharacterType extends BTNode {
    /**
     * The type of character to check for.
     */
    ctype: CharacterType;

    constructor({ ctype }: IsCharacterTypeProps) {
        super();
        this.ctype = ctype;
    }

    /**
     * Gets the type of the behavior tree node.
     * @returns {string} The type of the behavior tree node.
     */
    override getNodeType(): string {
        return "IsCharacterType";
    }

    /**
     * Gets the comment for the behavior tree node.
     * @returns {string} The comment for the behavior tree node.
     */
    override getComment(): string {
        return this.ctype;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        this.debug(`Character type: ${blackboard.character.ctype}. (Checking for ${this.ctype})`);

        return blackboard.character.ctype === this.ctype
            ? BTNodeStatus.Success
            : BTNodeStatus.Failure;
    }
}
