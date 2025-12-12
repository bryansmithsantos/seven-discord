import { Macro } from "../Macro";

export class TakeMacro extends Macro {
    constructor() {
        super({ name: "take", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const amount = parseInt(args[0]);
        const user = args[1] || ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (isNaN(amount) || !user) return "false";

        ctx.client.economy.remove(guildId, user, amount);
        return "true";
    }
}
