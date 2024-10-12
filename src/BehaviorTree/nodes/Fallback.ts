import { BTNodeStatus } from "../BTNodeStatus";
import { BTNode } from "../BTNode";
import { Blackboard } from "../Blackboard";
import { CompositeNode } from "./CompositeNode";

export interface FallbackProps {
    comment: string;
    children: BTNode[];
}

/**
 * Fallback node: Runs each child node in sequence until one succeeds or all fail.
 *
 * In the context of behavior trees, a fallback node is a composite node that represents a fallback behavior.
 * It is crucial in the control flow of behavior trees as it allows for the execution of alternative behaviors
 * when the primary behavior fails. The fallback node iterates through its child nodes in order and stops
 * as soon as it encounters a child node that succeeds. If all child nodes fail, the fallback node itself
 * is considered to have failed. This allows for graceful degradation of behavior and the ability to handle
 * different scenarios or contingencies in the behavior tree.
 */
export class Fallback extends CompositeNode {
    comment: string;

    constructor({ comment, children }: FallbackProps) {
        super(children);

        this.comment = comment;
    }

    override getNodeType(): string {
        return "Fallback";
    }

    override getComment(): string {
        return this.comment;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        this.debug(`Ticking node: ${this.comment} - Fallback`);

        for (const child of this.children) {
            // Tick each child node
            const status = child.tick(blackboard);

            // If a child node succeeds, return its status
            if (status !== BTNodeStatus.Failure) {
                return status;
            }
        }

        this.debug(`All children failed: ${this.comment} - Fallback`);

        // If all child nodes fail, return failure status
        return BTNodeStatus.Failure;
    }
}
