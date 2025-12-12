
import { Macro } from "../Macro";

export class UpdateInteractionMacro extends Macro {
    constructor() {
        super({
            name: "update",
            description: "Updates the component message. Usage: s.update",
            category: "ui",
            aliases: ["editOrigin"]
        });
    }

    async execute(ctx: any, ...args: string[]) {
        if (!ctx.interaction) return "";

        // 6: DEFERRED_UPDATE_MESSAGE (Silent ack, allowing edit later)
        // OR 7: UPDATE_MESSAGE (Immediate update if body provided, but here we likely want to defer update)

        // Let's default to defer update (Type 6) so s.edit() can be used downstream?
        // Actually, users usually want "s.update[New Content]".

        // If args provided, we return Type 7 with content.
        // If no args, we return Type 6 (Defer Update).

        if (args.length > 0 && args[0]) {
            return `INTERACTION_RESPONSE::${JSON.stringify({
                type: 7,
                data: { content: args.join(" ") }
            })}::END`;
        }

        return `INTERACTION_RESPONSE::${JSON.stringify({ type: 6 })}::END`;
    }
}
