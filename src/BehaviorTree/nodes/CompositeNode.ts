import { BTNode } from "../BTNode";
import { BTNodeVisitor } from "../BTNodeVisitor";

/**
 * Abstract base class for composite nodes in a behavior tree.
 * Composite nodes are nodes that have multiple child nodes.
 */
export abstract class CompositeNode extends BTNode {
    /**
     * The child nodes of the composite node.
     */
    protected children: BTNode[] = [];

    /**
     * Creates an instance of the CompositeNode class.
     * @param children - The child nodes of the composite node.
     */
    constructor(children: BTNode[]) {
        super();
        this.children = children;
    }

    /**
     * Gets the type of the node.
     * @returns The type of the node as a string.
     */
    override getNodeType(): string {
        return "CompositeNode";
    }

    /**
     * Accepts a visitor and passes it to the children nodes.
     * @param visitor - The visitor to accept.
     * @param parentId - The ID of the parent node.
     */
    override accept(visitor: BTNodeVisitor, parentId: string | null = null): void {
        const id = visitor.visit(this, parentId);

        for (const child of this.children) {
            child.accept(visitor, id);
        }
    }
}
