import { BankPackName, IPosition, ItemName, MapName, MonsterName, NPCName } from "alclient";
import { Blackboard, BlackboardMarkedKey } from "../core/Blackboard";
import { BTNodeStatus } from "../core/BTNodeStatus";
import { AsyncNode } from "../core/nodes/AsyncNode";

/**
 * Represents a destination for smart movement.
 * The destination can be a position, item name, map name, monster name, NPC name, or bank pack name.
 */
type SmartMoveDestination = IPosition | ItemName | MapName | MonsterName | NPCName | BankPackName;

/**
 * Represents a destination or a key to look up a destination in the blackboard.
 */
type DestinationOrKey = SmartMoveDestination | BlackboardMarkedKey;

export interface MoveToProps {
    destinationOrKey: DestinationOrKey;
}

/**
 * Represents a node in the behavior tree that moves the character to a specified destination.
 * The destination can be provided directly or as a key to be looked up in the blackboard.
 */
export class MoveTo extends AsyncNode {
    /**
     * The destination for the character to move to.
     * It can be a direct destination or a key to look up the destination in the blackboard.
     */
    destinationOrKey: DestinationOrKey;

    /**
     * Creates a new instance of the MoveTo node.
     * @param destinationOrKey - The destination for the character to move to.
     */
    constructor({ destinationOrKey }: MoveToProps) {
        super();
        this.destinationOrKey = destinationOrKey;
        this.debug(`Created MoveTo node with destination: ${this.destinationOrKey}`);
    }

    /**
     * Gets the type of the behavior tree node.
     * @returns The type of the behavior tree node.
     */
    override getNodeType(): string {
        return "MoveTo";
    }

    /**
     * Gets a comment representing the destination of the character.
     * @returns A comment representing the destination of the character.
     */
    override getComment(): string {
        return typeof this.destinationOrKey === "string"
            ? this.destinationOrKey
            : JSON.stringify(this.destinationOrKey);
    }

    /**
     * Executes the tick operation asynchronously.
     * Moves the character to the specified destination.
     * @param blackboard - The blackboard object containing the state of the behavior tree.
     * @returns A promise that resolves to the status of the behavior tree node.
     */
    override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
        let realDestination = this.destinationOrKey;

        try {
            // If the destination is a key, resolve it to the actual destination from the blackboard
            if (typeof realDestination === "string" && realDestination.startsWith("key:")) {
                this.debug("MoveTo: Resolving destination key from blackboard", realDestination);

                if (!blackboard.has(realDestination)) {
                    console.error(
                        "MoveTo: destination key not found in blackboard",
                        this.destinationOrKey,
                    );
                    return BTNodeStatus.Failure;
                }

                realDestination = blackboard.get<SmartMoveDestination>(realDestination)!;
            }

            this.debug("MoveTo: Moving to destination", realDestination);

            // Execute the smart move to the resolved destination
            await blackboard.character.smartMove(realDestination as SmartMoveDestination);
        } catch (error) {
            console.error("MoveTo: error moving to destination", realDestination);
            console.error(error);
            return BTNodeStatus.Failure;
        }

        this.debug("MoveTo: Successfully moved to destination", realDestination);
        return BTNodeStatus.Success;
    }
}
