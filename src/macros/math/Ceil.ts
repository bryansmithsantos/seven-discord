import { Macro } from "../Macro";

export class CeilMacro extends Macro {
    constructor() {
        super({ name: "ceil", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const num = parseFloat(args[0]);
        if (isNaN(num)) return "NaN";
        return Math.ceil(num).toString();
    }
}
