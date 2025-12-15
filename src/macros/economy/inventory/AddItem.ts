import { Macro } from "../../Macro";

export class AddItemMacro extends Macro {
    constructor() {
        super({
            name: "addItem",
            description: "Adds an item to the shop (Admin).",
            usage: "s.addItem[id; price; name]",
            example: "s.addItem[sword; 100; Iron Sword]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Parse KV or Positional
        // s.addItem[id:sword; price:100; name:Iron Sword]

        // Simplified Logic for v2.5
        const id = args[0];
        const price = parseInt(args[1]);
        const name = args[2] || id;

        if (!id || isNaN(price)) return "false";

        ctx.client.economy.addToShop(guildId, { id, price, name });
        return "true";
    }
}
