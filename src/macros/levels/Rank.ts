import { Macro } from "../Macro";

export class RankMacro extends Macro {
    constructor() {
        super({
            name: "rank",
            description: "Shows user level and XP.",
            usage: "s.rank",
            example: "s.rank",
            category: "levels"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;
        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;

        // Support checking other users if arg is provided (omitted for speed unless simple)
        let targetId = userId;
        if (args[0] && args[0].startsWith("<@")) {
            targetId = args[0].replace(/[<@!>]/g, "");
        }

        const xp = ctx.client.levels.getXp(guildId, targetId);
        const level = ctx.client.levels.getLevel(xp);
        const nextLevelXp = ctx.client.levels.xpForLevel(level + 1);

        return `📊 **Rank Card**\nLevel: ${level}\nXP: ${xp} / ${nextLevelXp}`;
    }
}
