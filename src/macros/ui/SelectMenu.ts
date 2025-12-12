
import { Macro } from "../Macro";

export class SelectMenuMacro extends Macro {
    constructor() {
        super({
            name: "selectMenu",
            aliases: ["menu", "select"],
            description: "Creates a select menu. Usage: s.selectMenu[id; placeholder; options...]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let customId, placeholder;
        let min = 1, max = 1;
        let options: any[] = [];

        // Check for Named Arguments (KV) - but also handle mixed style
        // If args contain explicit kv pairs for id/placeholder, assume KV mode.
        // Otherwise, assume positional: id, placeholder, ...options

        const hasKV = args.some(a => (a.startsWith("id:") || a.startsWith("placeholder:")) && !a.startsWith("http"));

        if (hasKV) {
            // KV Parsing Loop
            for (const arg of args) {
                if (arg.startsWith("Option::") || arg.startsWith("SelectOption::")) {
                    // pre-parsed option macro? unlikely used this way but support it
                    continue;
                }

                // Check for standard properties
                const split = arg.indexOf(":");
                if (split > -1) {
                    const key = arg.substring(0, split).trim().toLowerCase();
                    const val = arg.substring(split + 1).trim();

                    if (key === "id" || key === "custom_id") customId = val;
                    else if (key === "placeholder" || key === "text") placeholder = val;
                    else if (key === "min") min = parseInt(val);
                    else if (key === "max") max = parseInt(val);
                    else {
                        // Assume it's an inline option: Label:Value
                        options.push({ label: key, value: val });
                    }
                } else {
                    // Just a label, use as value too? or ignore?
                    // Let's assume Label=Value
                    options.push({ label: arg, value: arg });
                }
            }
        } else {
            // Positional: [id, placeholder, ...options]
            customId = args[0];
            placeholder = args[1];

            // Remaining args are options
            for (let i = 2; i < args.length; i++) {
                const arg = args[i];
                if (arg.includes(":")) {
                    const [l, v] = arg.split(":");
                    options.push({ label: l.trim(), value: v.trim() });
                } else {
                    options.push({ label: arg, value: arg });
                }
            }
        }

        if (options.length === 0) return "No options provided.";

        // Fix casing for display
        const finalOptions = options.map(o => ({
            label: o.label.substring(0, 100), // Discord Limit
            value: o.value.substring(0, 100),
            default: false
        }));

        const select = {
            type: 3, // String Select
            custom_id: customId,
            placeholder: placeholder || "Select an option",
            options: finalOptions,
            min_values: min || 1,
            max_values: max || 1
        };

        return `COMPONENT_SELECT::${JSON.stringify(select)}::END`;
    }
}
