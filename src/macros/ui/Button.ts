
import { Macro } from "../Macro";

export class ButtonMacro extends Macro {
    constructor() {
        super({
            name: "button",
            description: "Creates a button. Usage: s.button[label; style; custom_id; emoji?]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [label, styleStr, customId, emoji] = args;

        // Map styles
        const styles: any = {
            "primary": 1, "blue": 1,
            "secondary": 2, "gray": 2, "grey": 2,
            "success": 3, "green": 3,
            "danger": 4, "red": 4,
            "link": 5, "url": 5
        };

        const style = styles[styleStr?.toLowerCase()] || 1;
        const btn: any = {
            type: 2, // Button
            label: label,
            style: style
        };

        if (style === 5) {
            btn.url = customId; // Link buttons use url instead of custom_id
        } else {
            btn.custom_id = customId;
        }

        if (emoji) {
            // Simple emoji support (unicode or id?)
            // If it matches <:name:id>, parse it.
            if (emoji.startsWith("<:") || emoji.startsWith("<a:")) {
                const parts = emoji.replace(/<a?:|>/g, "").split(":");
                btn.emoji = { name: parts[0], id: parts[1], animated: emoji.startsWith("<a:") };
            } else {
                btn.emoji = { name: emoji };
            }
        }

        return `COMPONENT_BUTTON::${JSON.stringify(btn)}::END`;
    }
}
