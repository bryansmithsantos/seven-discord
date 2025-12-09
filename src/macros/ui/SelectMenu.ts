
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
        const [customId, placeholder, ...optionStrings] = args;

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
