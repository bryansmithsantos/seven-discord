
import { Macro } from "../Macro";

export class BankMacro extends Macro {
    constructor() {
        super({
            name: "bank",
            aliases: ["atm"],
            description: "Shows bank balance. Usage: s.bank[user_id?]",
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

        const bal = ctx.client.economy.getBankBalance(guildId, userId);
        const sym = ctx.client.economy.getSymbol();

        return `${sym}${bal}`;
    }
}
