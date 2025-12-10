
import { Macro } from "../Macro";

export class ModalMacro extends Macro {
    constructor() {
        super({
            name: "modal",
            description: "Shows a modal. Usage: s.modal[id:my_modal; title:My Modal; ...components]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        if (!ctx.interaction) return "Error: Modals can only be shown in interactions.";

        let customId, title;
        const components: any[] = [];
        const rawArgs = [];

        // Parse KV
        const map: any = {};
        for (const arg of args) {
            if (arg.startsWith("Input::")) {
                try {
                    const json = JSON.parse(arg.replace("Input::", "").replace("::END", ""));
                    components.push({
                        type: 1,
                        components: [json]
                    });
                } catch (e) { }
                continue;
            }

            const split = arg.indexOf(":");
            if (split > -1) {
                map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
            } else {
                rawArgs.push(arg);
            }
        }

        customId = map.id || map.custom_id || rawArgs[0];
        title = map.title || map.name || rawArgs[1] || "Modal";

        // Logic check: We need inputs. 
        // We probably need a s.input macro too, but user asked for 'Simplified Modal'.
        // Let's assume user uses a raw JSON or we make a helper macro s.input later.

        await ctx.client.rest.post(`/interactions/${ctx.interaction.id}/${ctx.interaction.token}/callback`, {
            type: 9, // Modal Submit
            data: {
                custom_id: customId,
                title: title,
                components: components
            }
        });

        // Modals don't return content to chat, they open a window.
        return "";
    }
}
