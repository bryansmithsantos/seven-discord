import { Macro } from "../Macro";

export class CoinflipMacro extends Macro {
    constructor() {
        super({ name: "coinflip", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const bet = parseInt(args[0]);
        const side = args[1]?.toLowerCase();

        if (!user || isNaN(bet)) return "Error";
        const balance = ctx.client.economy.getBalance(guildId, user);
        if (balance < bet) return "NoFunds";

        const result = Math.random() > 0.5 ? "heads" : "tails";
        const won = side === result;

        if (won) {
            ctx.client.economy.add(guildId, user, bet);
            return "Win";
        } else {
            ctx.client.economy.remove(guildId, user, bet);
            return "Lose";
        }
    }
}
