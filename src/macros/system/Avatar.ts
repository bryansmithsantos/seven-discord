
import { Macro } from "../Macro";

export class AvatarMacro extends Macro {
    constructor() {
        super({
            name: "avatar",
            description: "Shows user avatar URL. Usage: s.avatar[user?]",
            category: "system",
            aliases: ["av"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let [userId] = args;
        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        try {
            const user = await ctx.client.rest.get(`/users/${userId}`);
            if (!user.avatar) return user.default_avatar_url || ""; // Handling default? Discord logic complex

            // Format: https://cdn.discordapp.com/avatars/USER_ID/HASH.png
            return `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=1024`;
        } catch (e) {
            return "User not found.";
        }
    }
}
