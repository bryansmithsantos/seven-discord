
import { Macro } from "../Macro";

export class UpperMacro extends Macro {
    constructor() {
        super({
            name: "s.upper",
            description: "Uppercase text.",
            category: "string"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return (args[0] || "").toUpperCase();
    }
}
