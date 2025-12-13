import { Macro } from "../Macro";

export class WorkMacro extends Macro {
    constructor() {
        super({ name: "work", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        if (!user) return "";

        let minStr, maxStr;
        const hasKV = args.some(a => a.includes(":") && !a.match(/^\d+$/));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            minStr = map.min || map.minimum;
            maxStr = map.max || map.maximum;
        } else {
            [minStr, maxStr] = args;
        }

        const min = parseInt(minStr) || 10;
        const max = parseInt(maxStr) || 100;
        const earned = Math.floor(Math.random() * (max - min + 1) + min);

        ctx.client.economy.add(guildId, user, earned);
        return earned.toString();
    }
}
