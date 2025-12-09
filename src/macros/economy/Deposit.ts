
import { Macro } from "../Macro";

export class DepositMacro extends Macro {
    constructor() {
        super({
            name: "deposit",
            aliases: ["dep"],
            description: "Deposits money to bank. Usage: s.deposit[amount]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [amountStr] = args;
        if (!amountStr) return "false";

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;

        let amount: number;

        if (amountStr.toLowerCase() === "all") {
            amount = ctx.client.economy.getBalance(guildId, userId);
        } else {
            amount = parseInt(amountStr);
        }

        if (isNaN(amount) || amount <= 0) return "false";

        const success = ctx.client.economy.deposit(guildId, userId, amount);
        return String(success);
    }
}
