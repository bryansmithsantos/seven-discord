
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

        // 1. Simple Parser for our custom embed syntax (s.title -> EMBED_TITLE)
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

        const urlMatch = cleanContent.match(/EMBED_URL::(.*?)::END/s);
        if (urlMatch) embed.url = urlMatch[1];

        const tsMatch = cleanContent.match(/EMBED_TIMESTAMP::(.*?)::END/s);
        if (tsMatch) embed.timestamp = tsMatch[1] === "now" ? new Date().toISOString() : tsMatch[1];

        const authorMatch = cleanContent.match(/EMBED_AUTHOR::(.*?)::(.*?)::(.*?)::END/s);
        if (authorMatch) {
            embed.author = {
                name: authorMatch[1],
                icon_url: authorMatch[2] || undefined,
                url: authorMatch[3] || undefined
            };
        }

        // Fields (Global Search)
        const fieldRegex = /EMBED_FIELD::(.*?)::(.*?)::(.*?)::END/gs;
        let fMatch;
        const fields = [];
        while ((fMatch = fieldRegex.exec(cleanContent)) !== null) {
            fields.push({
                name: fMatch[1],
                value: fMatch[2],
                inline: fMatch[3] === "true"
            });
        }
        if (fields.length > 0) embed.fields = fields;

        // 2. Sugar Syntax Parser (KV usage inside s.embed directly)
        // e.g. s.embed[title:Hello; color:red]
        for (const arg of args) {
            const split = arg.indexOf(":");
            if (split > -1) {
                const key = arg.substring(0, split).trim().toLowerCase();
                const val = arg.substring(split + 1).trim();

                if (key === "title") embed.title = val;
                if (key === "desc" || key === "description") embed.description = val;
                if (key === "color") embed.color = parseInt(val.replace("#", ""), 16);
                if (key === "image" || key === "img") embed.image = { url: val };
                if (key === "thumb" || key === "thumbnail") embed.thumbnail = { url: val };
                if (key === "footer") embed.footer = { text: val };
                if (key === "url") embed.url = val;
            }
        }

        // Return safely with components separated
        // Transform to Base64 to ensure Safe Transport through Interpreter (no regex/semicolon issues)
        const payload = JSON.stringify({ embed, components });
        const b64 = Buffer.from(payload).toString("base64");

        return `<<B64_EMBED>>${b64}::END`;
    }
}
