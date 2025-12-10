
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
        let userId;

        // Check for KV
        const hasKV = args.some(a => a.includes(":") && !a.startsWith("http"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            userId = map.user || map.id || map.target;
        } else {
            userId = args[0];
        }

        // If no ID provided, default to author
        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        // Feature: If input is already a URL, just return it (flexibility)
        if (userId.startsWith("http")) return userId;

        try {
            // If it's "server" or "guild", get guild icon
            if (userId === "server" || userId === "guild") {
                const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
                const guild = await ctx.client.rest.get(`/guilds/${guildId}`);
                if (!guild.icon) return "";
                return `https://cdn.discordapp.com/icons/${guildId}/${guild.icon}.png?size=1024`;
            }

            // User Avatar
            const user = await ctx.client.rest.get(`/users/${userId}`);
            if (!user.avatar) return user.default_avatar_url || "";

            // Format: https://cdn.discordapp.com/avatars/USER_ID/HASH.png
            return `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.png?size=1024`;
        } catch (e) {
            return "User not found.";
        }
    }
}
