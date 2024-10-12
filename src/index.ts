import AL from "alclient";
import path from "path";
import Debug from "debug";
import { Blackboard } from "./BehaviorTree/Blackboard";
import { behaviorTree } from "./bt";

const debug = Debug("AL:BT:index");

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
    AL.Game.setServer("https://thmsn.adventureland.community");
    const SECURE_LOGIN = true;

    const credentialsPath = path.resolve(__dirname, "../secrets.json");

    await Promise.all([AL.Game.loginJSONFile(credentialsPath, SECURE_LOGIN), AL.Game.getGData()]);
    await AL.Pathfinder.prepare(AL.Game.G);

    const telogas = await AL.Game.startRanger("Telogas", "EU", "I");
    const teloglia = await AL.Game.startRanger("Teloglia", "EU", "I");

    const telogasBlackboard = new Blackboard(telogas, [teloglia], "Telogas");
    const telogliaBlackboard = new Blackboard(teloglia, [telogas], "Teloglia");

    while (true) {
        debug("======================");
        debug("======== Tick ========");
        debug("======================");

        debug("-- Telogas --");
        behaviorTree.tick(telogasBlackboard);

        debug("-- Teloglia --");
        behaviorTree.tick(telogliaBlackboard);

        await sleep(50);
    }
}
run();
