
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
        let label, styleStr, customId, emoji;
        let disabled = false;
        let url = null;

        // Check for Named Arguments (KV)
        const hasKV = args.some(a => a.includes(":") && !a.startsWith("http"));

        if (hasKV) {
            const map: any = {};
            for (const arg of args) {
                const split = arg.indexOf(":");
                if (split > -1) {
                    const key = arg.substring(0, split).trim().toLowerCase();
                    const val = arg.substring(split + 1).trim();
                    map[key] = val;
                }
            }
            label = map.label || map.l || map.name;
            styleStr = map.style || map.s;
            customId = map.id || map.custom_id || map.customId;
            url = map.url || map.link;
            emoji = map.emoji || map.e || map.icon;

            // Allow explicit "disabled:true"
            if (map.disabled === "true" || map.disabled === "yes") disabled = true;

        } else {
            [label, styleStr, customId, emoji] = args;
        }

        // Auto-detect URL style if URL is provided
        if (url) {
            styleStr = "link";
            customId = url; // for link buttons, url goes in url field, but we store it here temp
        }

        const styles: any = {
            "primary": 1, "blue": 1, "blurple": 1,
            "secondary": 2, "gray": 2, "grey": 2,
            "success": 3, "green": 3,
            "danger": 4, "red": 4,
            "link": 5, "url": 5
        };

        const style = styles[styleStr?.toLowerCase()] || 1;

        const btn: any = {
            type: 2,
            label: label || "Button",
            style: style,
            disabled: disabled
        };

        if (style === 5) {
            btn.url = customId;
        } else {
            btn.custom_id = customId;
        }

        if (emoji) {
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
