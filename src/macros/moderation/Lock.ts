
import { Macro } from "../Macro";

export class LockMacro extends Macro {
    constructor() {
        super({
            name: "lock",
            description: "Locks the channel. Usage: s.lock[channel_id?]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let [channelId] = args;
        if (!channelId) {
            channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;
        }

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Overwrite @everyone permissions
        // Deny SEND_MESSAGES (0x800)
        await ctx.client.rest.put(`/channels/${channelId}/permissions/${guildId}`, {
            id: guildId, // @everyone role ID is same as guild ID
            type: 0, // Role
            deny: "2048", // 0x800 (Send Messages) reference
            allow: "0"
        });

        return "Channel Locked.";
    }
}
