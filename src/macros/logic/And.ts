import { Macro } from "../Macro";

export class AndMacro extends Macro {
    constructor() {
        super({ name: "and", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const cond1 = args[0] === "true";
        const cond2 = args[1] === "true";
        return (cond1 && cond2).toString();
    }
}
