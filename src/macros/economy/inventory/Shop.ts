import { Macro } from "../../Macro";

export class ShopMacro extends Macro {
    constructor() {
        super({
            name: "shop",
            description: "Shows the server shop.",
            usage: "s.shop",
            example: "s.shop",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const shop = ctx.client.economy.getShop(guildId);

        if (shop.length === 0) return "Shop Empty";

        return shop.map((i: any) => `${i.name}: ${ctx.client.economy.getSymbol()}${i.price}`).join("\n");
    }
}
