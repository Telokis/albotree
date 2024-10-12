import { BTNode } from "../BTNode";
import { BTNodeStatus } from "../../BTNodeStatus";
import { Blackboard } from "../Blackboard";

export interface AlwaysSucceedDecoratorProps {
    /**
     * The child node to be decorated.
     */
    children: BTNode;
}

/**
 * Represents a decorator node that ensures its child node always succeeds.
 *
 * In a behavior tree, the AlwaysSucceedDecorator modifies the status of its child node:
 * - Success remains Success
 * - Running remains Running
 * - Failure becomes Success
 */
export class AlwaysSucceedDecorator extends BTNode {
    private child: BTNode;

    constructor({ children }: AlwaysSucceedDecoratorProps) {
        super();
        this.child = children;
    }

    override getNodeType(): string {
        return `AlwaysSucceed(${this.child.getNodeType()})`;
    }

    override getComment(): string {
        return `AlwaysSucceed(${this.child.getComment()})`;
    }

    override tick(blackboard: Blackboard): BTNodeStatus {
        const status = this.child.tick(blackboard);

        switch (status) {
            case BTNodeStatus.Failure:
                return BTNodeStatus.Success;
            default:
                return status; // Success and Running statuses remain unchanged
        }
    }
}

/**
 * Creates an AlwaysSucceedDecorator node that ensures the given node always succeeds.
 *
 * @param node - The node to be decorated.
 * @returns A new AlwaysSucceedDecorator instance that modifies the result of the given node.
 */
export function AlwaysSucceed(node: BTNode): BTNode {
    return new AlwaysSucceedDecorator({ children: node });
}
