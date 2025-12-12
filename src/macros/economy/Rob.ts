import { Macro } from "../Macro";

export class RobMacro extends Macro {
    constructor() {
        super({ name: "rob", category: "economy" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const victim = args[0];
        const user = ctx.author?.id;
        const guildId = ctx.interaction ? ctx.interaction.guild_id : ctx.message.guild_id;

        if (!user || !victim) return "Error";

        const victimBal = ctx.client.economy.getBalance(guildId, victim);
        if (victimBal < 10) return "TooPoor";

        const success = Math.random() > 0.6;
        if (success) {
            const amount = Math.floor(victimBal * 0.2);
            ctx.client.economy.remove(guildId, victim, amount);
            ctx.client.economy.add(guildId, user, amount);
            return amount.toString();
        } else {
            const fine = 50;
            ctx.client.economy.remove(guildId, user, fine);
            return "Fail";
        }
    }
}
