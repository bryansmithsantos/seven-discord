
import { Macro } from "../Macro";

export class SetStatusMacro extends Macro {
    constructor() {
        super({
            name: "s.setStatus",
            description: "Set bot status.",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        // args: [Type, Status, Name] 
        // Type: playing (0), streaming (1), listening (2), watching (3)
        // Status: online, dnd, idle

        const typeStr = (args[0] || "playing").toLowerCase();
        const status = (args[1] || "online").toLowerCase();
        const name = args[2] || "Seven-Discord";

        let type = 0;
        if (typeStr === "streaming") type = 1;
        if (typeStr === "listening") type = 2;
        if (typeStr === "watching") type = 3;

        ctx.client.gateway.setPresence(status, name, type);
        return "";
    }
}
