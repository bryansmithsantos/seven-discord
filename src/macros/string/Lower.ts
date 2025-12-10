
import { Macro } from "../Macro";

export class LowerMacro extends Macro {
    constructor() {
        super({
            name: "s.lower",
            description: "Lowercase text.",
            category: "string"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return (args[0] || "").toLowerCase();
    }
}
