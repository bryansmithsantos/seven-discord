import { Macro } from "../Macro";

export class PlayMacro extends Macro {
    constructor() {
        super({
            name: "play",
            description: "Plays audio from a URL.",
            usage: "s.play[url]",
            example: "s.play[http://radio.com/stream.mp3]",
            category: "voice"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const url = args[0];
        if (!url) return "false";

        // Logic to play audio. 
        // Since we are "native" and minimal, checking for a player.
        // v2.6.0 will have the UDP sender here.
        // For now, we simulate the "Playing" state.

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        // Check connection
        if (!ctx.client.voice.connections.has(guildId)) {
            // Auto join?
            const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
            const guild = ctx.client.gateway.guilds.get(guildId);
            const voiceState = guild?.voice_states?.find((vs: any) => vs.user_id === userId);
            if (voiceState) {
                ctx.client.voice.joinVoiceChannel(guildId, voiceState.channel_id);
            } else {
                return "User not in voice";
            }
        }

        // Mock success for v2.5.25 framework
        // "Connected and playing (Simulated for protocol v2.5)"
        return `Playing: ${url}`;
    }
}
