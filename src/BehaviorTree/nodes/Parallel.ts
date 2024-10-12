import { BTNodeStatus } from "../BTNodeStatus";
import { BTNode } from "../BTNode";
import { Blackboard } from "../Blackboard";
import { CompositeNode } from "./CompositeNode";

export interface ParallelProps {
    comment: string;
    children: BTNode[];
}

interface ChildStatus {
    status: BTNodeStatus;
    finished: boolean;
}

/**
 * Parallel node: Runs all child nodes concurrently until all have finished.
 *
 * This node allows for simultaneous execution of multiple actions or conditions.
 * It returns:
 *  - Running while any children are still executing,
 *  - Success if all children succeeded, or
 *  - Failure if any child failed.
 *
 * Behavior:
 * 1. On each tick, it executes all unfinished child nodes.
 * 2. It returns Running status as long as any child node is still running.
 * 3. When all children have finished:
 *    - If all children succeeded, it returns Success.
 *    - If any child failed, it returns Failure.
 * 4. The node maintains the state of each child across multiple ticks using the blackboard.
 */
export class Parallel extends CompositeNode {
    /**
     * The unique identifier of the async node.
     * This globally unique identifier is used to
     * store the promise and status of the node in the blackboard.
     */
    private statusKey = `Parallel_${this.nodeId}_childrenStatus`;

    private comment: string;

    constructor({ comment, children }: ParallelProps) {
        super(children);

        this.comment = comment;
    }

    override getNodeType(): string {
        return "Parallel";
    }

    override getComment(): string {
        return this.comment;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        this.debug(`Ticking node: ${this.comment} - Parallel`);

        let childrenStatus = blackboard.get<ChildStatus[]>(this.statusKey);

        if (!childrenStatus) {
            // Initialize child statuses if not present
            childrenStatus = this.children.map(() => ({
                status: BTNodeStatus.Running,
                finished: false,
            }));
        }

        let allFinished = true;
        let anyFailed = false;

        for (let i = 0; i < this.children.length; i++) {
            if (!childrenStatus[i].finished) {
                const status = this.children[i].tick(blackboard);
                childrenStatus[i].status = status;

                if (status === BTNodeStatus.Running) {
                    allFinished = false;
                } else {
                    childrenStatus[i].finished = true;

                    if (status === BTNodeStatus.Failure) {
                        anyFailed = true;
                    }
                }
            }
        }

        // Update the blackboard with the current status
        blackboard.set(this.statusKey, childrenStatus);

        if (allFinished) {
            // Reset the status in the blackboard for the next run
            blackboard.set(this.statusKey, undefined);

            if (anyFailed) {
                return BTNodeStatus.Failure;
            }

            return BTNodeStatus.Success;
        }

        return BTNodeStatus.Running;
    }
}
