
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
