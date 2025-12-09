
import { Macro } from "../Macro";

export class ServerInfoMacro extends Macro {
    constructor() {
        super({
            name: "serverInfo",
            description: "Shows server info. Usage: s.serverInfo",
            category: "system",
            aliases: ["guildInfo", "si"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Fetch guild via REST
        try {
            const guild = await ctx.client.rest.get(`/guilds/${guildId}`);

            return `**${guild.name}**\nID: ${guild.id}\nOwner ID: ${guild.owner_id}\nRegion: ${guild.region || "Unknown"}\nMembers: ${guild.approximate_member_count || "Unknown"}`;
        } catch (e) {
            return "Failed to fetch server info.";
        }
    }
}
