
import { Macro } from "../Macro";

export class OnInteractionMacro extends Macro {
    constructor() {
        super({
            name: "onInteraction",
            aliases: ["onButton", "buttonClicked", "onSelect"],
            description: "Sets code for an interaction. Usage: s.onInteraction[id; code]",
            category: "ui",
            disableNestedParsing: true
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [customId, ...codeParts] = args;
        const code = codeParts.join(";"); // Rejoin code if split

        if (!customId || !code) return "Invalid usage.";

        // Use InteractionManager (via Client) to save this code
        // We need to ensure Client has InteractionManager accessible.
        // It is `ctx.client.interactions`.

        ctx.client.interactions.registerCode(customId, code);
        return "";
    }
}
