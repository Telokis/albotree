import { BTNode } from "./BTNode"; // eslint-disable-line import/no-cycle

/**
 * Represents a visitor for traversing a behavior tree.
 * This abstract class defines the contract for implementing a visitor that can visit different types of BTNodes in a behavior tree.
 */
export abstract class BTNodeVisitor {
    /**
     * Visits a BTNode in the behavior tree.
     * This method should be implemented by subclasses to perform specific operations on the visited node.
     *
     * @param node - The BTNode to visit.
     * @param parentId - The ID of the parent node, if any.
     * @returns The ID of the visited node.
     */
    abstract visit(node: BTNode, parentId?: string | null): string;
}
