import { Macro } from "../../Macro";

export class SellMacro extends Macro {
    constructor() {
        super({
            name: "sell",
            description: "Sells an item for 50% value.",
            usage: "s.sell[item]",
            example: "s.sell[sword]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        const item = args[0];

        if (!item) return "false";

        return ctx.client.economy.sellItem(guildId, userId, item);
    }
}
