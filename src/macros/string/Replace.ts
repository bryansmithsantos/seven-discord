import { Macro } from "../Macro";

export class ReplaceMacro extends Macro {
    constructor() {
        super({ name: "replace", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].replace(args[1], args[2] || "");
    }
}
