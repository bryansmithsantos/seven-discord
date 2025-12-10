
import { Macro } from "../Macro";
import { ReplyMacro } from "./Reply"; // Reuse payload parser

export class SendMacro extends Macro {
    constructor() {
        super({
            name: "send",
            description: "Sends a message to a specific channel. Usage: s.send[ChannelID; Content]",
            category: "core"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        if (args.length < 2) return;

        const channelId = args[0];
        const content = args.slice(1).join(" "); // Join rest as content

        const payload = ReplyMacro.parsePayload(content);

        try {
            await ctx.client.rest.post(`/channels/${channelId}/messages`, payload);
        } catch (e) {
            // Fail silently or log
        }
    }
}
