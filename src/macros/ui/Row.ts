
import { Macro } from "../Macro";

export class RowMacro extends Macro {
    constructor() {
        super({
            name: "row",
            description: "Creates an Action Row. Usage: s.row[components...]",
            category: "ui"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // args might be space separated JSON strings from inner macros
        const content = args.join(" ");

        // Extract all COMPONENT_ (BUTTON/SELECT)
        const components: any[] = [];

        const regex = /COMPONENT_(?:BUTTON|SELECT)::(.*?)::END/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            try {
                components.push(JSON.parse(match[1]));
            } catch (e) { }
        }

        if (components.length === 0) return "";

        const row = {
            type: 1, // Action Row
            components: components
        };

        return `COMPONENT_ROW::${JSON.stringify(row)}::END`;
    }
}
