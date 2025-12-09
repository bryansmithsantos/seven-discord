
import { Macro } from "../Macro";

export class UnmuteMacro extends Macro {
    constructor() {
        super({
            name: "unmute",
            description: "Removes timeout. Usage: s.unmute[user_id; reason?]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [userIdStr, reason] = args;
        if (!userIdStr) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        await ctx.client.rest.patch(`/guilds/${guildId}/members/${userIdStr}`, {
            communication_disabled_until: null, // Remove timeout
            reason: reason || "Unmuted by Seven-Discord"
        });
    }
}
