
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

        // Hoist Components (Buttons, SelectMenus) that were nested
        const components: any[] = [];

        // Regex to find components: COMPONENT_BUTTON::{...}::END
        // We need to capture them and REMOVE them from the content so they don't mess up embed parsing
        const componentRegex = /COMPONENT_[A-Z]+::(.*?)::END/gs;
        let match;
        // 'content' IS available here from args joined earlier? 
        // Wait, line 43 in previous error said 'content' not found.
        // Let's check where content is defined.
        // Ah, in my previous edit I removed `const content = args.join(" ");` !!!
        // I need to add that back.

        const content = args.join(" ");

        while ((match = componentRegex.exec(content)) !== null) {
            try {
                components.push(JSON.parse(match[1]));
            } catch (e) { }
        }

        const cleanContent = content.replace(componentRegex, "");

        // Simple Parser for our custom embed syntax
        const titleMatch = cleanContent.match(/EMBED_TITLE::(.*?)::END/s);
        if (titleMatch) embed.title = titleMatch[1];

        const descMatch = cleanContent.match(/EMBED_DESC::(.*?)::END/s);
        if (descMatch) embed.description = descMatch[1];

        const colorMatch = cleanContent.match(/EMBED_COLOR::(.*?)::END/s);
        if (colorMatch) embed.color = parseInt(colorMatch[1].replace("#", ""), 16);

        const imgMatch = cleanContent.match(/EMBED_IMAGE::(.*?)::END/s);
        if (imgMatch) embed.image = { url: imgMatch[1] };

        const thumbMatch = cleanContent.match(/EMBED_THUMB::(.*?)::END/s);
        if (thumbMatch) embed.thumbnail = { url: thumbMatch[1] };

        const footerMatch = cleanContent.match(/EMBED_FOOTER::(.*?)::END/s);
        if (footerMatch) embed.footer = { text: footerMatch[1] };

        // Return safely with components separated
        return `<<EMBED>>${JSON.stringify(embed)}<<COMPONENTS>>${JSON.stringify(components)}`;
    }
}
