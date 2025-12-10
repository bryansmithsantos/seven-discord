
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
    async execute(ctx: any, ...args: string[]) {
            let customId, placeholder, minValues, maxValues, optionsArg;

            const hasKV = args.some(a => a.includes(":") && !a.startsWith("http") && !a.startsWith("Option::"));

            let optionStrings: string[] = [];

            if (hasKV) {
                const map: any = {};
                const cleanArgs = [];

                for (const arg of args) {
                    // Important: Options might be passed as args too if not using KV correctly, 
                    // BUT s.option returns "Option::JSON::END". We must preserve these.
                    if (arg.startsWith("Option::") || arg.startsWith("SelectOption::")) {
                        optionStrings.push(arg);
                        continue;
                    }

                    const split = arg.indexOf(":");
                    if (split > -1) {
                        const key = arg.substring(0, split).trim().toLowerCase();
                        const val = arg.substring(split + 1).trim();
                        map[key] = val;
                    } else {
                        // Non-KV arg, assume it's an option string if it fails regex check later or ignored
                        // OR it's a positional arg mixed in? 
                        // Let's assume if KV is used, ALL metadata is KV, and Options are just appended args.
                        optionStrings.push(arg);
                    }
                }
                customId = map.id || map.custom_id || map.customId;
                placeholder = map.placeholder || map.place || map.text;
                minValues = parseInt(map.min || map.min_values || "1");
                maxValues = parseInt(map.max || map.max_values || "1");
            } else {
                // Fallback to positional: [id, placeholder, ...options]
                // We need to shift args to find options.
                customId = args[0];
                placeholder = args[1];
                optionStrings = args.slice(2);
                minValues = 1;
                maxValues = 1;
            }

            // Option syntax could be complex. 
            // Let's iterate args. If an arg looks like OPTION::JSON::END, use it.

            const content = optionStrings.join(" ");
            const options: any[] = [];

            const regex = /SelectOption::(.*?)::END/g;
            let match;
            while ((match = regex.exec(content)) !== null) {
                try {
                    options.push(JSON.parse(match[1]));
                } catch (e) { }
            }

            if (options.length === 0) return "No options provided.";

            const select = {
                type: 3, // String Select
                custom_id: customId,
                placeholder: placeholder || "Select an option",
                options: options,
                min_values: 1,
                max_values: 1 // Default single selection
            };

            return `COMPONENT_SELECT::${JSON.stringify(select)}::END`;
        }
    }
