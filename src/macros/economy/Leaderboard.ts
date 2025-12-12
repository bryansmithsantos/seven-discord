import { Macro } from "../Macro";
import { EconomyManager } from "../../managers/EconomyManager";

export class LeaderboardMacro extends Macro {
    constructor() {
        super({ name: "leaderboard", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        // Warning: This reads internal DB structure. Assuming Map.
        // EconomyManager needs a getAll method ideally.
        // For MVP, returning "Not Implemented" or trying to access simplified
        return "Not Implemented (Requires DB iteration update)";
    }
}
