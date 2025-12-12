
import { Macro } from "../Macro";

export class DeferMacro extends Macro {
    constructor() {
        super({
            name: "defer",
            description: "Defers the interaction (Thinking state). Usage: s.defer",
            category: "ui",
            aliases: ["thinking"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        if (!ctx.interaction) return ""; // Only for interactions

        // 5: DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        return `INTERACTION_RESPONSE::${JSON.stringify({ type: 5 })}::END`;
    }
}
