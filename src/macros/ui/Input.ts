
import { Macro } from "../Macro";

export class InputMacro extends Macro {
    constructor() {
        super({
            name: "input",
            description: "Creates a text input for modals. Usage: s.input[id:name; label:Name; style:short]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        let customId, label, style, placeholder, min, max, required;

        const map: any = {};
        for (const arg of args) {
            const split = arg.indexOf(":");
            if (split > -1) {
                map[arg.substring(0, split).trim().toLowerCase()] = arg.substring(split + 1).trim();
            }
        }

        customId = map.id || "input_" + Date.now();
        label = map.label || "Text Input";
        // Style: 1 = Short, 2 = Paragraph
        style = (map.style === "paragraph" || map.style === "long") ? 2 : 1;
        placeholder = map.placeholder;
        min = map.min ? parseInt(map.min) : undefined;
        max = map.max ? parseInt(map.max) : undefined;
        required = map.required === "true";

        const input: any = {
            type: 4,
            custom_id: customId,
            label: label,
            style: style,
            required: required
        };
        if (placeholder) input.placeholder = placeholder;
        if (min) input.min_length = min;
        if (max) input.max_length = max;

        return `Input::${JSON.stringify(input)}::END`;
    }
}
