import { Macro } from "../Macro";

export class EndsWithMacro extends Macro {
    constructor() {
        super({ name: "endsWith", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].endsWith(args[1]).toString();
    }
}
