
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
        let amountStr;

        const hasKV = args.some(a => a.includes(":"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            amountStr = map.amount || map.amt || map.value;
        } else {
            [amountStr] = args;
        }

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
