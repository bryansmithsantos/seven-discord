import { Macro } from "../Macro";

export class GuildCountMacro extends Macro {
    constructor() {
        super({ name: "guildCount", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return ctx.client.guilds.cache.size.toString();
    }
}
