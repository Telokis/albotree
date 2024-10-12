import { BTNode } from "../BTNode";
import { BTNodeVisitor } from "../BTNodeVisitor";

/**
 * Visitor for generating a Mermaid graph from a behavior tree.
 */
export class MermaidGraphVisitor extends BTNodeVisitor {
    /**
     * An array to store the names of the nodes in the graph.
     */
    private nodes: string[] = [];

    /**
     * An array to store the edges between nodes in the graph.
     */
    private edges: string[] = [];

    /**
     * Visits a behavior tree node and adds it to the graph.
     * @param node - The behavior tree node to visit.
     * @param parentId - The ID of the parent node in the graph.
     * @returns The ID of the visited node.
     */
    override visit(node: BTNode, parentId: string | null = null): string {
        const id = node.getNodeId();
        const nodeName = node.getNodeType();
        const comment = node.getComment();

        const desc = comment ? `${nodeName} - ${comment}` : nodeName;

        this.nodes.push(`Node${id}["${desc.replaceAll('"', "&quot;")}"]`);

        if (parentId !== null) {
            this.edges.push(`Node${parentId} --> Node${id}`);
        }

        return id;
    }

    /**
     * Gets the generated Mermaid graph.
     * @returns The Mermaid graph as a string.
     */
    getGraph(): string {
        return ["graph TD", this.nodes.join("\n"), this.edges.join("\n")].join("\n");
    }
}
