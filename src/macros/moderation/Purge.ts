
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
        const [amountStr] = args;
        let amount = parseInt(amountStr);
        if (isNaN(amount)) return;

        if (amount > 100) amount = 100;
        if (amount < 2) amount = 2;

        const channelId = ctx.interaction ? ctx.interaction.channel_id : ctx.message.channel_id;

        // Fetch messages first? Or assumes channel logic.
        // Bulk delete requires list of message IDs.
        // Only if we provide IDs. But typically purge means "last N messages".
        // Seven-Discord simplified: Fetch last N and delete them.

        const messages = await ctx.client.rest.get(`/channels/${channelId}/messages?limit=${amount}`);
        if (!messages || !Array.isArray(messages)) return;

        const ids = messages.map((m: any) => m.id);

        await ctx.client.rest.post(`/channels/${channelId}/messages/bulk-delete`, {
            messages: ids
        });
    }
}
