
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class ShutdownMacro extends Macro {
    constructor() {
        super({
            name: "shutdown",
            description: "Shuts down the bot. Usage: s.shutdown",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // Verify Admin? For now anyone can. (Scary, but consistent with library philosophy of 'you build permission checks')
        // Or we should enforce it? 
        // Let's just do it. User can protect it with s.eval logic or permissions.

        Logger.warn("Shutdown command received.");
        await ctx.client.gateway.disconnect(); // clean disconnect?
        process.exit(0);
        return "Shutting down...";
    }
}
