
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class KickMacro extends Macro {
    constructor() {
        super({
            name: "kick",
            description: "Kicks a user from the guild.",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let [userId, reason] = args;

        if (!userId) return;
        if (!reason) reason = "Kicked by Seven-Discord";

        Logger.debug(`Attempting to kick ${userId}`);

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Note: DELETE /members/{user.id} is the endpoint for kick
        await ctx.client.rest.delete(`/guilds/${guildId}/members/${userId}`, {
            reason: reason
        });
    }
}
