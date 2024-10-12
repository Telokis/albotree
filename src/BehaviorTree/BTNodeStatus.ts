/**
 * Represents the status of a behavior tree node.
 */
export enum BTNodeStatus {
    /**
     * Indicates that the behavior tree node has completed successfully.
     */
    Success = "Success",

    /**
     * Indicates that the behavior tree node has failed to complete.
     */
    Failure = "Failure",

    /**
     * Indicates that the behavior tree node is currently running.
     */
    Running = "Running",
}
