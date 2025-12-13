
import { Macro } from "../Macro";

export class PurgeMacro extends Macro {
    constructor() {
        super({
            name: "purge",
            description: "Deletes messages. Usage: s.purge[amount]",
            category: "moderation",
            aliases: ["clear"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let amountStr;

        const hasKV = args.some(a => a.includes(":"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            amountStr = map.amount || map.amt || map.limit || map.cnt;
        } else {
            [amountStr] = args;
        }

        let amount = parseInt(amountStr);
        if (isNaN(amount)) return;

        if (amount > 100) amount = 100;
        if (amount < 2) amount = 2;

        const channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;

        // Fetch messages first to delete
        const messages = await ctx.client.rest.get(`/channels/${channelId}/messages?limit=${amount}`);
        // ... bulk delete below
        if (!messages || !Array.isArray(messages)) return;

        const ids = messages.map((m: any) => m.id);

        await ctx.client.rest.post(`/channels/${channelId}/messages/bulk-delete`, {
            messages: ids
        });
    }
}
