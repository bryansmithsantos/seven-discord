import { Macro } from "../Macro";

export class FloorMacro extends Macro {
    constructor() {
        super({ name: "floor", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const num = parseFloat(args[0]);
        if (isNaN(num)) return "NaN";
        return Math.floor(num).toString();
    }
}
