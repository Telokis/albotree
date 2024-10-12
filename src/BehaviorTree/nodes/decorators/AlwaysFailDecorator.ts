import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../../BTNodeStatus";
import { Blackboard } from "../Blackboard";

export interface AlwaysFailDecoratorProps {
    /**
     * The child node to be decorated.
     */
    children: BTNode;
}

/**
 * Represents a decorator node that ensures its child node always fails.
 *
 * In a behavior tree, the AlwaysFailDecorator modifies the status of its child node:
 * - Success becomes Failure
 * - Failure remains Failure
 * - Running remains Running
 */
export class AlwaysFailDecorator extends BTNode {
    private child: BTNode;

    constructor({ children }: AlwaysFailDecoratorProps) {
        super();
        this.child = children;
    }

    override getNodeType(): string {
        return `AlwaysFail(${this.child.getNodeType()})`;
    }

    override getComment(): string {
        return `AlwaysFail(${this.child.getComment()})`;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        const status = this.child.tick(blackboard);

        switch (status) {
            case BTNodeStatus.Success:
                return BTNodeStatus.Failure;
            default:
                return status; // Failure and Running statuses remain unchanged
        }
    }
}

/**
 * Creates an AlwaysFailDecorator node that ensures the given node always fails.
 *
 * @param node - The node to be decorated.
 * @returns A new AlwaysFailDecorator instance that modifies the result of the given node.
 */
export function AlwaysFail(node: BTNode): BTNode {
    return new AlwaysFailDecorator({ children: node });
}
