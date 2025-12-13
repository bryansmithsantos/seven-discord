import { Macro } from "../Macro";

export class EmbedTitleMacro extends Macro {
    constructor() { super({ name: "title", description: "Sets embed title", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_TITLE::${args.join(" ")}::END`; }
}

export class EmbedDescMacro extends Macro {
    constructor() { super({ name: "description", aliases: ["desc"], description: "Sets embed description", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_DESC::${args.join(" ")}::END`; }
}

export class EmbedColorMacro extends Macro {
    constructor() { super({ name: "color", description: "Sets embed color (Hex)", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_COLOR::${args[0]}::END`; }
}

export class EmbedImageMacro extends Macro {
    constructor() { super({ name: "image", aliases: ["img"], description: "Sets embed image", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_IMAGE::${args[0]}::END`; }
}

export class EmbedThumbMacro extends Macro {
    constructor() { super({ name: "thumbnail", aliases: ["thumb"], description: "Sets embed thumbnail", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_THUMB::${args[0]}::END`; }
}

export class EmbedFooterMacro extends Macro {
    constructor() { super({ name: "footer", description: "Sets embed footer", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_FOOTER::${args.join(" ")}::END`; }
}

export class EmbedUrlMacro extends Macro {
    constructor() { super({ name: "url", description: "Sets embed url", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_URL::${args[0]}::END`; }
}

export class EmbedAuthorMacro extends Macro {
    constructor() { super({ name: "author", description: "Sets embed author. Usage: s.author[name; icon?; url?]", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) {
        let name, icon, url;
        const hasKV = args.some(a => a.includes(":"));
        if (hasKV) {
            const map: any = {};
            args.forEach(arg => {
                const split = arg.indexOf(":");
                if (split > -1) {
                    map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
                }
            });
            name = map.name || map.title || map.author;
            icon = map.icon || map.url || map.avatar || map.image;
            url = map.link || map.href || map.url; // 'url' is ambiguous here if checking for both, check context usually, but map.url usually icon in author? No Discord API: name, url(link), icon_url. 
            // Correct mapping:
            if (map.name) name = map.name;
            if (map.icon) icon = map.icon;
            if (map.url) url = map.url; // Assuming url = link to click
            if (map.link) url = map.link;
            // Fallback for icon if they used 'avatar'
            if (map.avatar) icon = map.avatar;
        } else {
            [name, icon, url] = args;
        }
        return `EMBED_AUTHOR::${name || ""}::${icon || ""}::${url || ""}::END`;
    }
}

export class EmbedFieldMacro extends Macro {
    constructor() { super({ name: "field", description: "Adds a field. Usage: s.field[name; value; inline?]", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) {
        return `EMBED_FIELD::${args[0]}::${args[1]}::${args[2] || "false"}::END`;
    }
}

export class EmbedTimestampMacro extends Macro {
    constructor() { super({ name: "timestamp", description: "Sets timestamp (default now)", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) { return `EMBED_TIMESTAMP::${args[0] || "now"}::END`; }
}
