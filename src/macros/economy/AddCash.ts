import { Macro } from "../Macro";

export class AddCashMacro extends Macro {
    constructor() {
        super({
            name: "addCash",
            description: "Adds money to a user. Usage: s.addCash[amount; user_id?]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [amountStr, userIdStr] = args;
        const amount = parseInt(amountStr);
        if (isNaN(amount)) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        let userId = userIdStr;

        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        const newBal = ctx.client.economy.add(guildId, userId, amount);
        return String(newBal); // Return new balance for convenience
    }
}
