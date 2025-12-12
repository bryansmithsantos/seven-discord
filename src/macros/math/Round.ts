import { Macro } from "../Macro";

export class RoundMacro extends Macro {
    constructor() {
        super({ name: "round", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const num = parseFloat(args[0]);
        if (isNaN(num)) return "NaN";
        return Math.round(num).toString();
    }
}
