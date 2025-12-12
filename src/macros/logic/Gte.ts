import { Macro } from "../Macro";

export class GteMacro extends Macro {
    constructor() {
        super({ name: "gte", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const a = parseFloat(args[0]);
        const b = parseFloat(args[1]);
        if (isNaN(a) || isNaN(b)) return "false";
        return (a >= b).toString();
    }
}
