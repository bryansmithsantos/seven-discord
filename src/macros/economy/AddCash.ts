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
            userId = map.user || map.id || map.target; // userIdStr
        } else {
            [amountStr, userId] = args;
        }

        const amount = parseInt(amountStr);
        if (isNaN(amount)) return "0"; // Return valid string if nan

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        const newBal = ctx.client.economy.add(guildId, userId, amount);
        return String(newBal); // Return new balance for convenience
    }
}
