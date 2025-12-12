import { Macro } from "../Macro";

export class CapitalizeMacro extends Macro {
    constructor() {
        super({ name: "capitalize", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        if (!args[0]) return "";
        return args[0].charAt(0).toUpperCase() + args[0].slice(1);
    }
}
