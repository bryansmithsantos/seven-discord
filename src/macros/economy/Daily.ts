import { Macro } from "../Macro";

export class DailyMacro extends Macro {
    constructor() {
        super({ name: "daily", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        if (!user) return "";

        const amount = parseInt(args[0]) || 100;
        ctx.client.economy.add(guildId, user, amount);
        return amount.toString();
    }
}
