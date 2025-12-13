import { Macro } from "../Macro";

export class CoinflipMacro extends Macro {
    constructor() {
        super({ name: "coinflip", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        let betStr, side;
        const hasKV = args.some(a => a.includes(":") && !a.match(/^\d+$/));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            betStr = map.amount || map.bet || map.value;
            side = map.side || map.choice || map.pick;
        } else {
            [betStr, side] = args;
        }

        const bet = parseInt(betStr);
        side = side?.toLowerCase();

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
