
import { Macro } from "../Macro";

export class LenMacro extends Macro {
    constructor() {
        super({
            name: "s.len",
            description: "Get length of text.",
            category: "string"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return String((args[0] || "").length);
    }
}
