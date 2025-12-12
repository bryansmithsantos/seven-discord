import { Macro } from "../Macro";

export class SplitMacro extends Macro {
    constructor() {
        super({ name: "split", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const text = args[0];
        const sep = args[1] || " ";
        const index = parseInt(args[2]);
        const parts = text.split(sep);
        if (!isNaN(index)) return parts[index] || "";
        return parts.join(",");
    }
}
