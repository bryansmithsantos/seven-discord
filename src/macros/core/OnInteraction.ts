
import { Macro } from "../Macro";

export class OnInteractionMacro extends Macro {
    constructor() {
        super({
            name: "onInteraction",
            description: "Registers code to be executed when an interaction (button/menu) is triggered. Usage: s.onInteraction[custom_id; code]",
            category: "core",
            // This is a setup macro, doesn't output text usually.
        });
    }

    async execute(ctx: any, ...args: string[]) {
        if (args.length < 2) return "";
        const [customId, ...codeParts] = args;
        const code = codeParts.join(";"); // Rejoin if split by accident, though interpreter splits arguments.

        // Register to Client Interaction Manager
        ctx.client.interactions.registerCode(customId.trim(), code.trim());

        return ""; // logic macro, return empty
    }
}
