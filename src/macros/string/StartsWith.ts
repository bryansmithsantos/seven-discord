import { Macro } from "../Macro";

export class StartsWithMacro extends Macro {
    constructor() {
        super({ name: "startsWith", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].startsWith(args[1]).toString();
    }
}
