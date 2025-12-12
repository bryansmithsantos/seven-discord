import { Macro } from "../Macro";

export class ReplaceAllMacro extends Macro {
    constructor() {
        super({ name: "replaceAll", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].replaceAll(args[1], args[2] || "");
    }
}
