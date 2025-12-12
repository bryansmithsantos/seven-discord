import { Macro } from "../Macro";

export class AbsMacro extends Macro {
    constructor() {
        super({ name: "abs", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const num = parseFloat(args[0]);
        if (isNaN(num)) return "NaN";
        return Math.abs(num).toString();
    }
}
