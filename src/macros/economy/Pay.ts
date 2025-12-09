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
        const [amountStr, targetId] = args;
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
