import { Macro } from "../Macro";

export class GambleMacro extends Macro {
    constructor() {
        super({ name: "gamble", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        let betStr;
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
        } else {
            [betStr] = args;
        }

        const bet = parseInt(betStr);

        if (!user || isNaN(bet)) return "Error";

        const balance = ctx.client.economy.getBalance(guildId, user);
        if (balance < bet) return "NoFunds";

        const won = Math.random() > 0.5;
        if (won) {
            ctx.client.economy.add(guildId, user, bet); // Add winning amount (bet already present)
            return "Win";
        } else {
            ctx.client.economy.remove(guildId, user, bet);
            return "Lose";
        }
    }
}
