import { Macro } from "../Macro";

export class WorkMacro extends Macro {
    constructor() {
        super({ name: "work", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        if (!user) return "";

        const min = parseInt(args[0]) || 10;
        const max = parseInt(args[1]) || 100;
        const earned = Math.floor(Math.random() * (max - min + 1) + min);

        ctx.client.economy.add(guildId, user, earned);
        return earned.toString();
    }
}
