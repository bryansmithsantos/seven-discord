
import { Macro } from "../Macro";

export class UnlockMacro extends Macro {
    constructor() {
        super({
            name: "unlock",
            description: "Unlocks the channel. Usage: s.unlock[channel_id?]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let [channelId] = args;
        if (!channelId) {
            channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;
        }

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Reset @everyone permissions (allow 2048 or remove deny?)
        // Better: Set allow/deny to 0 or explicit allow?
        // Let's explicitly Allow Send Messages to be safe, or just clear the deny.

        await ctx.client.rest.put(`/channels/${channelId}/permissions/${guildId}`, {
            id: guildId,
            type: 0,
            deny: "0",
            allow: "2048" // ADD Send Messages
        });

        return "Channel Unlocked.";
    }
}
