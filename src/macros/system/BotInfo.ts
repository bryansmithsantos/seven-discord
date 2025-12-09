
import { Macro } from "../Macro";

export class BotInfoMacro extends Macro {
    constructor() {
        super({
            name: "botInfo",
            description: "Shows bot statistics. Usage: s.botInfo",
            category: "system",
            aliases: ["stats", "bi"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const servers = 1; // Single shard
        const commands = ctx.client.commands.size;

        // We can fetch user count from gateway cache if available, or just mock it as "Unknown" for now
        // since we don't have a full cache manager yet.

        return `**Stats:**\nRAM: ${ram} MB\nServers: ${servers}\nCommands: ${commands}\nPlatform: Bun`;
    }
}
