import { Macro } from "../Macro";

export class MaxMacro extends Macro {
    constructor() {
        super({ name: "max", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const nums = args.map(parseFloat).filter(n => !isNaN(n));
        if (nums.length === 0) return "NaN";
        return Math.max(...nums).toString();
    }
}
