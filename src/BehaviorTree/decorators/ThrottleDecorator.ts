import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../BTNodeStatus";
import { Blackboard } from "../Blackboard";

export interface ThrottleDecoratorProps {
    /**
     * The delay in milliseconds between allowed executions of the child node.
     * If the child node returns Running, it can be ticked continuously without throttling.
     */
    delay: number;

    /**
     * The child node to be throttled.
     * It will not be ticked more frequently than the specified delay.
     */
    children: BTNode;
}

/**
 * ThrottleDecorator is a behavior tree node decorator that limits the execution rate of its child node.
 * It ensures that the child node is not ticked more frequently than the specified delay.
 * If the child node returns Running, it can be ticked continuously without throttling.
 */
export class ThrottleDecorator extends BTNode {
    /**
     * The child node to be throttled.
     */
    private child: BTNode;

    /**
     * The delay in milliseconds between allowed executions of the child node.
     */
    private delay: number;

    /**
     * Key for storing the last execution time in the blackboard.
     */
    private lastExecKey = `ThrottleDecorator_${this.nodeId}_lastExec`;

    /**
     * Key for storing the last result of the child node in the blackboard.
     */
    private lastResultKey = `ThrottleDecorator_${this.nodeId}_lastResult`;

    /**
     * Constructs a new ThrottleDecorator instance.
     * @param delay - The delay in milliseconds between allowed executions of the child node.
     * @param child - The child node to be throttled.
     */
    constructor({ delay, children }: ThrottleDecoratorProps) {
        super();
        this.child = Array.isArray(children) ? children[0] : children;
        this.delay = delay;
    }

    /**
     * Gets the type of the node.
     * @returns A string representing the type of the node, including its child node type.
     */
    override getNodeType(): string {
        return `Throttle(${this.child.getNodeType()})`;
    }

    /**
     * Gets the comment of the node.
     * @returns A string representing the comment of the node, including its child node comment and the delay.
     */
    override getComment(): string {
        const childComment = this.child.getComment();

        if (childComment.length === 0) {
            return `${this.delay}ms`;
        }

        return `(${childComment}) by ${this.delay}ms`;
    }

    /**
     * Executes the tick operation on the node.
     * This method checks the elapsed time since the last execution and decides whether to tick the child node or return the last result.
     * If the last execution finished and the delay has not passed, it returns the last result.
     * Otherwise, it ticks the child node, updates the blackboard with the current time and the result, and returns the result.
     * @param blackboard - The blackboard object used to store and retrieve data during the behavior tree execution.
     * @returns The status of the node after the tick operation.
     */
    override tick(blackboard: Blackboard): BTNodeStatus {
        const currentTime = Date.now();
        const lastExecTime = blackboard.get<number>(this.lastExecKey) ?? 0;
        const lastResult = blackboard.get<BTNodeStatus>(this.lastResultKey);

        // If the last execution finished and the delay has not passed, return the last result
        if (
            lastResult !== undefined &&
            lastResult !== BTNodeStatus.Running &&
            currentTime - lastExecTime < this.delay
        ) {
            return lastResult;
        }

        const status = this.child.tick(blackboard);

        // Update blackboard
        blackboard.set(this.lastExecKey, currentTime);
        blackboard.set(this.lastResultKey, status);

        return status;
    }
}

/**
 * Creates a ThrottleDecorator that limits the execution rate of the given node.
 * @param delay - The delay in milliseconds between allowed executions of the node.
 * @param node - The node to be throttled.
 * @returns A new ThrottleDecorator instance wrapping the given node.
 */
export function Throttle(delay: number, node: BTNode): BTNode {
    return new ThrottleDecorator({ delay, children: node });
}
