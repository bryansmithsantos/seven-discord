import { Macro } from "../Macro";

export class RoleCountMacro extends Macro {
    constructor() {
        super({ name: "roleCount", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const guild = ctx.message?.guild || ctx.interaction?.guild;
        if (!guild) return "0";
        return guild.roles.cache.size.toString();
    }
}
