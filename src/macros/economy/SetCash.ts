
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
        let amountStr, userId;

        const hasKV = args.some(a => a.includes(":") && !a.match(/^\d+$/));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            amountStr = map.amount || map.amt || map.value;
            userId = map.user || map.id || map.target;
        } else {
            [amountStr, userId] = args;
        }

        const amount = parseInt(amountStr);
        if (isNaN(amount)) return "0";

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        ctx.client.economy.setBalance(guildId, userId, amount);
        return String(amount);
    }
}
