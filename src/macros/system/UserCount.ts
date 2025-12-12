import { Macro } from "../Macro";

export class UserCountMacro extends Macro {
    constructor() {
        super({ name: "userCount", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        // Approximate user count (cache or fetch size if available)
        return ctx.client.users.cache.size.toString();
    }
}
