
import { Macro } from "../Macro";

export class UnwarnMacro extends Macro {
    constructor() {
        super({
            name: "unwarn",
            description: "Removes a warning. Usage: s.unwarn[user; index?]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let userId, indexStr;

        const hasKV = args.some(a => a.includes(":") && !a.startsWith("http"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            userId = map.user || map.target || map.id || map.member;
            indexStr = map.index || map.i || map.case;
        } else {
            [userId, indexStr] = args;
        }

        if (!userId) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const key = `warnings_${guildId}_${userId}`;

        const existing = ctx.client.variables.get(key, "global");
        if (!existing || !Array.isArray(existing) || existing.length === 0) return "User has no warnings.";

        // Index 1-based
        let index = existing.length - 1; // Default last (0-based)
        if (indexStr) {
            const parsed = parseInt(indexStr);
            if (!isNaN(parsed) && parsed > 0 && parsed <= existing.length) {
                index = parsed - 1;
            }
        }

        existing.splice(index, 1);
        ctx.client.variables.set(key, existing, "global");

        return `Removed warning #${index + 1}. Total: ${existing.length}`;
    }
}
