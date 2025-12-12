import { Macro } from "../Macro";

export class ClientIDMacro extends Macro {
    constructor() {
        super({ name: "clientID", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return ctx.client.user.id;
    }
}
