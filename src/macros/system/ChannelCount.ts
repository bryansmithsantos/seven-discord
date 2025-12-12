import { Macro } from "../Macro";

export class ChannelCountMacro extends Macro {
    constructor() {
        super({ name: "channelCount", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return ctx.client.channels.cache.size.toString();
    }
}
