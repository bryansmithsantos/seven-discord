import { Macro } from "../Macro";

export class PollMacro extends Macro {
    constructor() {
        super({
            name: "poll",
            description: "Creates a simple poll.",
            usage: "s.poll[question; option1; option2]",
            example: "s.poll[Pizza?; Yes; No]",
            category: "fun"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const question = args[0];
        const opts = args.slice(1);

        if (!question || opts.length < 2) return "Usage: s.poll[Question; Opt1; Opt2...]";

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

        let desc = "";
        opts.forEach((opt, i) => {
            if (i < 10) desc += `${emojis[i]} ${opt}\n`;
        });

        // This macro is special, it needs to send an embed and react.
        // Returning a string is standard behavior, but here we want to send an embed.
        // We can use s.embed logic manually or return a JSON str if interpreter supports it.
        // For simplicity in v2.5, we construct a text poll or rely on s.embed being called separately.

        // ACTUALLY: The interpreter writes the return value to the channel.
        // We can return an embed object string if the parser supports that, OR we use the client to send immediately.

        // "Native" approach: Send strictly via return value?
        // Let's format it as a nice text block for now.

        return `📊 **${question}**\n\n${desc}`;
    }
}
