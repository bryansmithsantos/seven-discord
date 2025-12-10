
import { Macro } from "../Macro";

export class IfMacro extends Macro {
    constructor() {
        super({
            name: "s.if",
            description: "Conditional logic.",
            category: "logic"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const condition = args[0];
        const trueBranch = args[1] || "";
        const falseBranch = args[2] || "";

        if (condition === "true" || condition === "1" || (condition && condition.length > 0 && condition !== "false" && condition !== "0")) {
            return trueBranch;
        }
        return falseBranch;
    }
}
