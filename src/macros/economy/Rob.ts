import { Macro } from "../Macro";

export class RobMacro extends Macro {
    constructor() {
        super({ name: "rob", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        let victim;
        const hasKV = args.some(a => a.includes(":") && !a.startsWith("http")); // Rob usually user id, not http
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            victim = map.user || map.target || map.id || map.victim;
        } else {
            [victim] = args;
        }

        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (!user || !victim) return "Error";

        const victimBal = ctx.client.economy.getBalance(guildId, victim);
        if (victimBal < 10) return "TooPoor";

        const success = Math.random() > 0.6;
        if (success) {
            const amount = Math.floor(victimBal * 0.2);
            ctx.client.economy.remove(guildId, victim, amount);
            ctx.client.economy.add(guildId, user, amount);
            return amount.toString();
        } else {
            const fine = 50;
            ctx.client.economy.remove(guildId, user, fine);
            return "Fail";
        }
    }
}
