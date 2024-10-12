/* eslint-disable max-classes-per-file */

import Debug from "debug";
import { Blackboard } from "./Blackboard";
import { BTNodeStatus } from "./BTNodeStatus";
import { BTNodeVisitor } from "./BTNodeVisitor"; // eslint-disable-line import/no-cycle
import { UniqueID } from "./UniqueID";
import { BTEvent } from "./BTEvent";

export class BTNodeEvents {
    /** Emitted at the start of the tick method. */
    tickStart = new BTEvent<void>();

    /** Emitted at the end of the tick method, whatever the status. */
    tickEnd = new BTEvent<BTNodeStatus>();

    /** Emitted when the node logs a message. */
    debug = new BTEvent<string>();
}

/**
 * Abstract base class for behavior tree nodes.
 */
export abstract class BTNode {
    protected nodeId = UniqueID.getUniqueID();

    private debugger!: Debug.Debugger;

    public events: BTNodeEvents = new BTNodeEvents();

    constructor() {
        this._wrapTickMethod();
    }

    /**
     * Method to get the type of the node.
     * This will be used to identify the type of the node.
     * @returns The type of the node.
     */
    getNodeType(): string {
        return "BTNode";
    }

    getNodeId(): string {
        return this.nodeId;
    }

    /**
     * Log method that uses the Debug instance.
     * @param message - The message to log.
     * @param ...args - Additional arguments to log.
     */
    protected debug(message: string, ...args: any[]): void {
        if (!this.debugger) {
            this.debugger = Debug(`BT:${this.getNodeType()}:${this.getNodeId()}`);
        }

        this.debugger(message, ...args);
        this.events.debug.emit(`${message} ${args.join(" ")}`);
    }

    /**
     * Abstract method to be implemented by concrete nodes.
     * This method should contain the logic of the node.
     * @param blackboard - The blackboard object.
     * @returns The status of the node's execution.
     */
    abstract tick(blackboard: Blackboard): BTNodeStatus;

    /**
     * Method to get a dynamic comment.
     * A comment is a string that describes the node's behavior
     * at a given moment in time in a human-readable way.
     * For example, a MoveTo node could return a comment like
     * "Moving to (10, 20)".
     * @returns The dynamic comment.
     */
    abstract getComment(): string;

    /**
     * Method to accept a visitor.
     * This method is used to implement the Visitor pattern.
     * @param visitor - The visitor object.
     * @param parentId - The ID of the parent node, if any. Default is null.
     */
    accept(visitor: BTNodeVisitor, parentId: string | null = null): void {
        visitor.visit(this, parentId);
    }

    // Wrapping the tick method lets us hook events into it
    private _wrapTickMethod() {
        const originalTick = this.tick;

        this.tick = (blackboard: Blackboard): BTNodeStatus => {
            this.events.tickStart.emit();

            this.debug("Tick");

            const status = originalTick.call(this, blackboard);

            this.events.tickEnd.emit(status);

            return status;
        };
    }
}
