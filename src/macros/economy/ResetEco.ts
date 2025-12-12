import { Macro } from "../Macro";

export class ResetEcoMacro extends Macro {
    constructor() {
        super({ name: "resetEco", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = args[0] || ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (!user) return "false";

        ctx.client.economy.setBalance(guildId, user, 0);
        ctx.client.economy.setBankBalance(guildId, user, 0);
        return "true";
    }
}
