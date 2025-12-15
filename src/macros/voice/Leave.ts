import { Macro } from "../Macro";

export class LeaveMacro extends Macro {
    constructor() {
        super({
            name: "leave",
            description: "Leaves the voice channel.",
            usage: "s.leave",
            example: "s.leave",
            category: "voice"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        ctx.client.voice.leaveVoiceChannel(guildId);
        return "true";
    }
}
