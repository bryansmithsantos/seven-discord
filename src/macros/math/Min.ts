import { Macro } from "../Macro";

export class MinMacro extends Macro {
    constructor() {
        super({ name: "min", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const nums = args.map(parseFloat).filter(n => !isNaN(n));
        if (nums.length === 0) return "NaN";
        return Math.min(...nums).toString();
    }
}
