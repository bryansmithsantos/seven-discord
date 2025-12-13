import { Macro } from "../Macro";

export class PayMacro extends Macro {
    constructor() {
        super({
            name: "pay",
            description: "Transfers money. Usage: s.pay[amount; target_id]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let amountStr, targetId;

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
            targetId = map.user || map.target || map.id || map.to;
        } else {
            [amountStr, targetId] = args;
        }

        const amount = parseInt(amountStr);

        if (isNaN(amount) || !targetId) return "false";
        if (amount <= 0) return "false";

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const authorId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;

        if (authorId === targetId) return "false";

        const success = ctx.client.economy.transfer(guildId, authorId, targetId, amount);
        return String(success);
    }
}
