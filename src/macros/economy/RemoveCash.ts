
import { Macro } from "../Macro";

export class RemoveCashMacro extends Macro {
    constructor() {
        super({
            name: "removeCash",
            description: "Removes money from a user. Usage: s.removeCash[amount; user_id?]",
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

        const newBal = ctx.client.economy.remove(guildId, userId, amount);
        return String(newBal);
    }
}
