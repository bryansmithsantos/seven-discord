
import { Macro } from "../Macro";
// Native JSON build only.
// Seven-Discord dependency philosophy: Minimal. We build raw JSON objects.

export class EmbedMacro extends Macro {
    constructor() {
        super({
            name: "embed",
            description: "Creates an embed. Usage: s.embed[properties...]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // The args will be the RESULT of inner macros (s.title, etc).
        // Inner macros should return partial JSON strings or special markers?
        // OR: We use a different approach.
        // If s.title returns "title:Hello", we can parse it.
        // But the Interpreter runs inner macros FIRST.
        // So `s.embed[s.title[Hi]]` -> `s.embed["title:Hi"]` (if s.title returns that).

        // Let's make Emved Builder macros return special delimiter strings.
        // "EMBED_TITLE::Value"

        const embed: any = {};

        // args are joined by comman usually? No, Interpreter splits by ";".
        // But if user does s.embed[ s.title[] s.desc[] ], the space might be an issue if not split by ;
        // If they use spaces/newlines, args might come in weird if we don't handle splitting strictly.

        // Actually, if Interpreter parses recursively, `s.title[...]` is replaced by its output string.
        // So `s.embed[ TITLE::Hi DESC::Bye ]`.
        // We can just regex this content.

        const content = args.join(" "); // Rejoin in case split by newline/space

        // Simple Parser for our custom embed syntax
        const titleMatch = content.match(/EMBED_TITLE::(.*?)::END/s);
        if (titleMatch) embed.title = titleMatch[1];

        const descMatch = content.match(/EMBED_DESC::(.*?)::END/s);
        if (descMatch) embed.description = descMatch[1];

        const colorMatch = content.match(/EMBED_COLOR::(.*?)::END/s);
        if (colorMatch) embed.color = parseInt(colorMatch[1].replace("#", ""), 16);

        const imgMatch = content.match(/EMBED_IMAGE::(.*?)::END/s);
        if (imgMatch) embed.image = { url: imgMatch[1] };

        const thumbMatch = content.match(/EMBED_THUMB::(.*?)::END/s);
        if (thumbMatch) embed.thumbnail = { url: thumbMatch[1] };

        const footerMatch = content.match(/EMBED_FOOTER::(.*?)::END/s);
        if (footerMatch) embed.footer = { text: footerMatch[1] };

        // Handle Fields later if needed.

        // We return the Stringified JSON of the embed. 
        // usage in s.reply needs to know it's an embed.
        // s.reply checks if input starts with { "embed": ... }?
        // Or we use a special marker for s.reply to parse.

        return `<<EMBED>>${JSON.stringify(embed)}`;
    }
}
