import { Macro } from "../../Macro";

export class InventoryMacro extends Macro {
    constructor() {
        super({
            name: "inventory",
            description: "Shows user inventory.",
            usage: "s.inventory",
            example: "s.inventory",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;

        const inv = ctx.client.economy.getInventory(guildId, userId);
        if (inv.length === 0) return "Empty";

        // Return simple list "ID (Amount)"
        return inv.map((i: any) => `${i.id} (x${i.amount})`).join(", ");
    }
}
