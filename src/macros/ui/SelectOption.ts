
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
        const [label, value, desc, emoji] = args;

        const opt: any = {
            label: label,
            value: value || label,
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
