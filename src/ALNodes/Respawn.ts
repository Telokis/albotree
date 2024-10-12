import { Blackboard } from "../core/Blackboard";
import { BTNodeStatus } from "../core/BTNodeStatus";
import { AsyncNode } from "../core/nodes/AsyncNode";

export class Respawn extends AsyncNode {
    override getNodeType(): string {
        return "Respawn";
    }

    override getComment(): string {
        return "";
    }

    override async tickAsync(blackboard: Blackboard): Promise<BTNodeStatus> {
        await blackboard.character.respawn();

        return BTNodeStatus.Success;
    }
}
