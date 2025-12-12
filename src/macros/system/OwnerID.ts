import { Macro } from "../Macro";

export class OwnerIDMacro extends Macro {
    constructor() {
        super({ name: "ownerID", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        // Might be undefined if not fetched, but usually application property exists
        return ctx.client.application?.owner?.id || "Unknown";
    }
}
