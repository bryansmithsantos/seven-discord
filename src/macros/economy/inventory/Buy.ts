import { Macro } from "../../Macro";

export class BuyMacro extends Macro {
    constructor() {
        super({
            name: "buy",
            description: "Buys an item from the shop.",
            usage: "s.buy[item]",
            example: "s.buy[sword]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        const item = args[0];

        if (!item) return "false";

        return ctx.client.economy.buyItem(guildId, userId, item);
    }
}
