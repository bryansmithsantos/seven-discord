
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
        let secondsStr, channelId;

        const hasKV = args.some(a => a.includes(":") && !a.match(/^\d+$/));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            secondsStr = map.time || map.seconds || map.sec || map.duration || map.t;
            channelId = map.channel || map.ch || map.id;
        } else {
            [secondsStr, channelId] = args;
        }

        const seconds = parseInt(secondsStr);
        if (isNaN(seconds)) return;

        if (!channelId) {
            channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;
        }

        await ctx.client.rest.patch(`/channels/${channelId}`, {
            rate_limit_per_user: seconds
        });
    }
}
