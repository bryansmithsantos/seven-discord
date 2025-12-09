
import { Macro } from "../Macro";

export class UserInfoMacro extends Macro {
    constructor() {
        super({
            name: "userInfo",
            description: "Shows user info. Usage: s.userInfo[user?]",
            category: "system",
            aliases: ["whois", "ui"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let [userId] = args;
        if (!userId) {
            userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        }

        try {
            const user = await ctx.client.rest.get(`/users/${userId}`);
            return `**${user.username}**#${user.discriminator}\nID: ${user.id}\nBot: ${user.bot ? "Yes" : "No"}`;
        } catch (e) {
            return "User not found.";
        }
    }
}
