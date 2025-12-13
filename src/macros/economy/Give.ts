import { Macro } from "../Macro";

export class GiveMacro extends Macro {
    constructor() {
        super({ name: "give", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
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
        const user = userId || ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (isNaN(amount) || !user) return "false";

        ctx.client.economy.add(guildId, user, amount);
        return "true";
    }
}
