
import { Macro } from "../Macro";

export class SelectOptionMacro extends Macro {
    constructor() {
        super({
            name: "option",
            description: "Creates an option for select menu. Usage: s.option[label; value; desc?; emoji?]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let label, value, desc, emoji, isDefault;

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
            value = map.value || map.v || map.val || label;
            desc = map.desc || map.description || map.d;
            emoji = map.emoji || map.e || map.icon;
            isDefault = map.default === "true" || map.default === "yes";
        } else {
            [label, value, desc, emoji] = args;
        }

        const opt: any = {
            label: label || "Option",
            value: value || label || "option_value",
            default: isDefault || false
        };

        if (desc) opt.description = desc;

        if (emoji) {
            if (emoji.startsWith("<:") || emoji.startsWith("<a:")) {
                const parts = emoji.replace(/<a?:|>/g, "").split(":");
                opt.emoji = { name: parts[0], id: parts[1], animated: emoji.startsWith("<a:") };
            } else {
                opt.emoji = { name: emoji };
            }
        }

        return `SelectOption::${JSON.stringify(opt)}::END`;
    }
}
