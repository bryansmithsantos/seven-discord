
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class BanMacro extends Macro {
    constructor() {
        super({
            name: "ban",
            description: "Bans a user from the guild.",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // Syntax: s.ban[userID; Reason]
        // Args come as a single string usually if comma separated inside []? 
        // Interpreter logic needs to handle splitting if we want multi-arg standard.
        // For now, let's assume raw string comes in "id, reason" if split by interpreter, or we split here.
        // User requested s.ban[id].

        let [userId, reason] = args;

        if (!userId) return;
        if (!reason) reason = "Banned by Seven-Discord";

        Logger.debug(`Attempting to ban ${userId}`);

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        await ctx.client.rest.put(`/guilds/${guildId}/bans/${userId}`, {
            delete_message_days: 0,
            reason: reason
        });
    }
}
