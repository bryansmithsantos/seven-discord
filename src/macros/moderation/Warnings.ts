
import { Macro } from "../Macro";

export class WarningsMacro extends Macro {
    constructor() {
        super({
            name: "warnings",
            description: "Lists warnings. Usage: s.warnings[user]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [userId] = args;
        if (!userId) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const key = `warnings_${guildId}_${userId}`;

        const existing = ctx.client.variables.get(key, "global");
        if (!existing || !Array.isArray(existing) || existing.length === 0) return "No warnings.";

        // Format list
        return existing.map((w: any, i: number) => `**${i + 1}.** ${w.reason} (<@${w.moderator}>)`).join("\n");
    }
}
