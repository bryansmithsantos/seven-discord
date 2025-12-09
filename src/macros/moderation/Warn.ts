
import { Macro } from "../Macro";

export class WarnMacro extends Macro {
    constructor() {
        super({
            name: "warn",
            description: "Warns a user. Usage: s.warn[user; reason]",
            category: "moderation"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [userId, reason] = args;
        if (!userId) return;

        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const key = `warnings_${guildId}_${userId}`;

        // Get existing warnings
        const existing = ctx.client.variables.get(key, "global") || [];
        existing.push({
            reason: reason || "No reason provided",
            date: Date.now(),
            moderator: ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id
        });

        ctx.client.variables.set(key, existing, "global");

        // DM the user? (Optional, maybe later)
        return `Warned user ${userId}. Total warnings: ${existing.length}`;
    }
}
