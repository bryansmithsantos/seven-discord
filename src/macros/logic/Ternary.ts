import { Macro } from "../Macro";

export class TernaryMacro extends Macro {
    constructor() {
        super({ name: "ternary", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const cond = args[0] === "true";
        return cond ? args[1] : (args[2] || "");
    }
}
