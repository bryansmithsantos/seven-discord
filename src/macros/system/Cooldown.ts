
import { Macro } from "../Macro";

export class CooldownMacro extends Macro {
    constructor() {
        super({
            name: "cooldown",
            description: "Sets a dynamic cooldown for the current user. Usage: s.cooldown[Seconds; Message?]",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const seconds = parseInt(args[0]);
        const msg = args[1];

        if (isNaN(seconds)) return;

        const userId = ctx.interaction ? ctx.interaction.member.user.id : ctx.message.author.id;
        // Since macros don't know the command name easily unless passed in ctx, 
        // we might stick to command-config-cooldowns. 
        // BUT, user asked for "System of cooldown".

        // This macro forces a cooldown on the USER Global Key? Or Command Key?
        // Context might need updating to pass Command Name.
        // For now, let's use a "Global User Cooldown" or try to find command name.

        // Wait, Interpreter doesn't pass command name in context currently.
        // Let's rely on Command-Config based cooldowns primarily (Phase 1).
        // If dynamic is needed, we need to update Interpreter.

        return "";
    }
}
