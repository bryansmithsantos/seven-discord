
import { Macro } from "../Macro";

export class SetVarMacro extends Macro {
    constructor() {
        super({
            name: "setVar",
            description: "Sets a variable. Usage: s.setVar[name; value; type?; id?]",
            category: "core"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [name, value, typeStr, idStr] = args;

        if (!name || value === undefined) return;

        // Defaults
        const type = typeStr || "global"; // global, user, guild
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

        ctx.client.variables.set(name, value, type, id);
        // Returns nothing (void)
    }
}
