import { Macro } from "../Macro";

export class CashMacro extends Macro {
    constructor() {
        super({
            name: "cash",
            aliases: ["balance", "bal", "money"],
            description: "Shows user balance. Usage: s.cash[user_id?]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [userIdStr] = args;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        let userId = userIdStr;

        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        const bal = ctx.client.economy.getBalance(guildId, userId);
        const sym = ctx.client.economy.getSymbol();

        return `${sym}${bal}`;
    }
}
