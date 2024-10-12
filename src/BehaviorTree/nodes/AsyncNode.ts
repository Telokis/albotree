import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../BTNodeStatus";
import { Blackboard } from "../Blackboard";

/**
 * Represents the data for an asynchronous node in a behavior tree.
 */
export interface AsyncNodeData {
    /**
     * The promise associated with the asynchronous node.
     */
    promise: null | Promise<any>;

    /**
     * The status of the asynchronous node.
     */
    status: BTNodeStatus;
}

/**
 * Represents an asynchronous node in a behavior tree.
 *
 * This node is used to execute asynchronous tasks within a behavior tree.
 * It keeps track of the status of the asynchronous task and updates the blackboard accordingly.
 */
export abstract class AsyncNode extends BTNode {
    private promiseKey = `AsyncNode_${this.nodeId}_promise`;

    private statusKey = `AsyncNode_${this.nodeId}_status`;

    /**
     * Gets the type of the node.
     *
     * @returns The type of the node as a string.
     */
    override getNodeType(): string {
        return "AsyncNode";
    }

    /**
     * Gets the comment of the node.
     *
     * @returns The comment of the node as a string.
     */
    override getComment(): string {
        return "";
    }

    /**
     * Executes the tick operation on the node.
     *
     * This method is called by the behavior tree to update the status of the node.
     * It checks the status of the asynchronous task and updates the blackboard accordingly.
     *
     * @param blackboard - The blackboard object used to store and retrieve data during the behavior tree execution.
     * @returns The status of the node after the tick operation.
     */
    override tick(blackboard: Blackboard): BTNodeStatus {
        let promise = blackboard.get<Promise<BTNodeStatus> | null>(this.promiseKey);
        let status = blackboard.get<BTNodeStatus>(this.statusKey);

        // If the node is not in the blackboard, create it
        if (status === undefined || promise === undefined) {
            status = BTNodeStatus.Running;
            promise = null;
        }

        // If the promise is null, the node is not running
        if (promise === null) {
            status = BTNodeStatus.Running;

            promise = this.tickAsync(blackboard);

            promise
                .then((result) => {
                    this.debug("[ASYNC] Promise resolved with result", result);
                    blackboard.set(this.statusKey, result);
                })
                .catch((err) => {
                    this.debug("[ASYNC] Promise rejected with error", err);
                    blackboard.set(this.statusKey, BTNodeStatus.Failure);
                });
        }

        // When the status is not running, reset the promise
        if (status !== BTNodeStatus.Running) {
            promise = null;
        }

        blackboard.set(this.statusKey, status);
        blackboard.set(this.promiseKey, promise);

        this.debug("AsyncNode status", status);

        return status;
    }

    /**
     * Executes the asynchronous tick operation on the node.
     *
     * This method is called internally by the tick method to perform the asynchronous task.
     * Subclasses should override this method to implement their specific asynchronous logic.
     *
     * @param blackboard - The blackboard object used to store and retrieve data during the behavior tree execution.
     * @returns A promise that resolves to the status of the node after the asynchronous task is completed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    abstract tickAsync(blackboard: Blackboard): Promise<BTNodeStatus>;
}
