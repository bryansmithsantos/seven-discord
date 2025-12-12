import { Macro } from "../Macro";

export class PowMacro extends Macro {
    constructor() {
        super({ name: "pow", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const base = parseFloat(args[0]);
        const exp = parseFloat(args[1]);
        if (isNaN(base) || isNaN(exp)) return "NaN";
        return Math.pow(base, exp).toString();
    }
}
