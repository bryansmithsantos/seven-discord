import { Macro } from "../Macro";

export class JoinMacro extends Macro {
    constructor() {
        super({
            name: "join",
            description: "Joins the user's voice channel.",
            usage: "s.join",
            example: "s.join",
            category: "voice"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;

        // We need to find the channel the user is in.
        // Since we don't cache voice states individually per user deeply, 
        // we might check the guild cache or rely on Gateway cache if available.
        // For Seven-Discord v2.5, we'll try to get it from the guild cache if implemented.

        // Fallback: If we can't find it, we might ask for channel ID?
        // But s.join implies auto-detection.
        // Let's assume the Gateway/Cache has it.

        // Simplified for v2.5: User must provide ID if cache miss, or we assume cache works.
        // Actually, we can check the Guild object if populated.

        const guild = ctx.client.gateway.guilds.get(guildId);
        const voiceState = guild?.voice_states?.find((vs: any) => vs.user_id === userId);

        if (!voiceState) return "false"; // User not in voice

        ctx.client.voice.joinVoiceChannel(guildId, voiceState.channel_id);
        return "true";
    }
}
