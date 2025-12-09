
import { Macro } from "../Macro";

export class SlowmodeMacro extends Macro {
    constructor() {
        super({
            name: "slowmode",
            description: "Sets channel slowmode. Usage: s.slowmode[seconds; channel?]",
            category: "moderation",
            aliases: ["slow"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [secondsStr, channelIdStr] = args;
        const seconds = parseInt(secondsStr);
        if (isNaN(seconds)) return;

        let channelId = channelIdStr;
        if (!channelId) {
            channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;
        }

        await ctx.client.rest.patch(`/channels/${channelId}`, {
            rate_limit_per_user: seconds
        });
    }
}
