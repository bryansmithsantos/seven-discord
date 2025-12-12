import { Macro } from "../Macro";

export class GtMacro extends Macro {
    constructor() {
        super({ name: "gt", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const a = parseFloat(args[0]);
        const b = parseFloat(args[1]);
        if (isNaN(a) || isNaN(b)) return "false";
        return (a > b).toString();
    }
}
