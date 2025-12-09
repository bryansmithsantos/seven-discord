
import { Macro } from "../Macro";

export class SetCashMacro extends Macro {
    constructor() {
        super({
            name: "setCash",
            description: "Sets user's balance. Usage: s.setCash[amount; user_id?]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [amountStr, userIdStr] = args;
        const amount = parseInt(amountStr);
        if (isNaN(amount)) return "0";

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        let userId = userIdStr;

        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        ctx.client.economy.setBalance(guildId, userId, amount);
        return String(amount);
    }
}
