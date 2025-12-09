
import { Macro } from "../Macro";

export class GetVarMacro extends Macro {
    constructor() {
        super({
            name: "getVar",
            description: "Gets a variable. Usage: s.getVar[name; type?; id?]",
            category: "core"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [name, typeStr, idStr] = args;

        if (!name) return "";

        const type = typeStr || "global";
        let id = idStr || "0";

        // Auto-detect ID if type is 'user' or 'guild' and ID is missing
        if (!idStr) {
            if (type === "user") {
                const author = ctx.interaction ? ctx.interaction.member.user : ctx.message.author;
                id = author.id;
            } else if (type === "guild") {
                const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
                id = guildId;
            }
        }

        const val = ctx.client.variables.get(name, type, id);
        return val !== undefined ? String(val) : "";
    }
}
