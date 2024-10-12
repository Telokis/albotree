import { BTNodeStatus } from "../BTNodeStatus";
import { BTNode } from "../BTNode";
import { Blackboard } from "../Blackboard";
import { CompositeNode } from "./CompositeNode";

export interface SequenceProps {
    comment: string;
    children: BTNode[];
}

/**
 * Sequence node: Runs each child node in sequence until one fails or all succeed.
 *
 * A Sequence is a type of composite node in a behavior tree. It represents a sequence of actions or conditions that need to be executed in order. The Sequence node starts executing its children from the first child node and continues until one of the child nodes fails or all child nodes succeed.
 *
 * In the context of behavior trees, a Sequence is commonly used to represent a series of tasks that need to be performed in a specific order. For example, in a game AI, a Sequence node can be used to represent a sequence of actions that an AI character needs to perform to complete a specific task, such as navigating to a target location, attacking an enemy, and then returning to a safe location.
 *
 * The Sequence node follows a "fail-fast" behavior, which means that as soon as one child node fails, the Sequence node itself fails and stops executing its remaining child nodes. This allows for early termination of the sequence if any of the required conditions or actions fail.
 *
 * If all child nodes of a Sequence succeed, the Sequence node itself succeeds and returns a success status. This indicates that all the required tasks or conditions in the sequence have been successfully completed.
 *
 * The Sequence node is an essential building block in behavior tree design and provides a way to organize and control the flow of actions or conditions in a behavior tree.
 */
export class Sequence extends CompositeNode {
    comment: string;

    constructor({ comment, children }: SequenceProps) {
        super(children);

        this.comment = comment;
    }

    override getNodeType(): string {
        return "Sequence";
    }

    override getComment(): string {
        return this.comment;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        this.debug(`Ticking node: ${this.comment} - Sequence`);

        for (const child of this.children) {
            // Tick each child node
            const status = child.tick(blackboard);

            // If any child fails, return the failure status
            if (status !== BTNodeStatus.Success) {
                return status;
            }
        }

        this.debug(`All children succeeded: ${this.comment} - Sequence`);

        // If all children succeed, return success status
        return BTNodeStatus.Success;
    }
}
