import { Macro } from "../Macro";

export class TrimMacro extends Macro {
    constructor() {
        super({ name: "trim", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].trim();
    }
}
