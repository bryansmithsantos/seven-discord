import { Macro } from "../Macro";

export class SqrtMacro extends Macro {
    constructor() {
        super({ name: "sqrt", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const num = parseFloat(args[0]);
        if (isNaN(num)) return "NaN";
        return Math.sqrt(num).toString();
    }
}
