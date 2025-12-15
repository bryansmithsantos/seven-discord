
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

        let typeStr, status, name;

        const hasKV = args.some(a => a.includes(":"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            typeStr = map.type || map.activity;
            status = map.status || map.presence;
            name = map.name || map.title || map.text || map.content;
        } else {
            [typeStr, status, name] = args;
        }

        typeStr = (typeStr || "playing").toLowerCase();
        status = (status || "online").toLowerCase();
        name = name || "Seven-Discord";

        // Placeholders
        /* eslint-disable no-undef */
        const serverCount = ctx.client.guilds?.size || 0;
        const userCount = ctx.client.users?.size || 0;
        const ping = ctx.client.ws?.ping || 0;

        name = name
            .replace(/{servers}/g, serverCount.toString())
            .replace(/{guilds}/g, serverCount.toString())
            .replace(/{users}/g, userCount.toString())
            .replace(/{ping}/g, ping.toString());

        let type = 0;
        if (typeStr === "streaming") type = 1;
        if (typeStr === "listening") type = 2;
        if (typeStr === "watching") type = 3;
        if (typeStr === "competing") type = 5;

        ctx.client.gateway.setPresence(status, name, type);
        return "";
    }
}
