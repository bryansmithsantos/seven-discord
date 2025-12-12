import { Macro } from "../Macro";

export class EmojiCountMacro extends Macro {
    constructor() {
        super({ name: "emojiCount", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return ctx.client.emojis.cache.size.toString();
    }
}
