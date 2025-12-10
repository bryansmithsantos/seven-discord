
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class MuteMacro extends Macro {
    constructor() {
        super({
            name: "mute",
            description: "Timeouts a user. Usage: s.mute[duration; user_id; reason?]",
            category: "moderation",
            aliases: ["timeout"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let durationStr, userIdStr, reason;

        const hasKV = args.some(a => a.includes(":") && !a.match(/^\d+$/));

        if (hasKV) {
            const map: any = {};
            for (const arg of args) {
                const split = arg.indexOf(":");
                if (split > -1) {
                    const key = arg.substring(0, split).trim().toLowerCase();
                    const val = arg.substring(split + 1).trim();
                    map[key] = val;
                }
            }
            durationStr = map.time || map.duration || map.t || map.d;
            userIdStr = map.user || map.id || map.userid || map.target;
            reason = map.reason || map.r;
        } else {
            [durationStr, userIdStr, reason] = args;
        }

        if (!durationStr || !userIdStr) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        let userId = userIdStr;

        if (userId === "author") { // special keyword
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        // Parse Duration (simple)
        let ms = 0;
        if (durationStr.endsWith("s")) ms = parseInt(durationStr) * 1000;
        else if (durationStr.endsWith("m")) ms = parseInt(durationStr) * 60 * 1000;
        else if (durationStr.endsWith("h")) ms = parseInt(durationStr) * 60 * 60 * 1000;
        else if (durationStr.endsWith("d")) ms = parseInt(durationStr) * 24 * 60 * 60 * 1000;
        else ms = parseInt(durationStr) * 1000; // default seconds

        if (isNaN(ms)) return "Invalid Duration";

        const timeoutUntil = new Date(Date.now() + ms).toISOString();

        Logger.debug(`Muting ${userId} until ${timeoutUntil}`);

        await ctx.client.rest.patch(`/guilds/${guildId}/members/${userId}`, {
            communication_disabled_until: timeoutUntil,
            reason: reason || "Muted by Seven-Discord"
        });
    }
}
