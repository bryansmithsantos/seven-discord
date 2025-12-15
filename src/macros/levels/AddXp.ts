import { Macro } from "../Macro";

export class AddXpMacro extends Macro {
    constructor() {
        super({
            name: "addXp",
            description: "Adds XP to a user.",
            usage: "s.addXp[user; amount]",
            example: "s.addXp[@user; 100]",
            category: "levels"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        const userStr = args[0];
        const amount = parseInt(args[1]);

        if (!userStr || isNaN(amount)) return "false";

        const targetId = userStr.replace(/[<@!>]/g, "");

        const newXp = ctx.client.levels.addXp(guildId, targetId, amount);
        return `XP Added! New XP: ${newXp}`;
    }
}
