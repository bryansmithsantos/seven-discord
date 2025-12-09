
import { Macro } from "../Macro";

export class EqMacro extends Macro {
    constructor() {
        super({
            name: "eq",
            description: "Checks if two values are equal.",
            category: "logic"
        });
    }

    execute(ctx: any, ...args: string[]) {
        // Expected: [val1; val2; matching; notMatching]
        // Complex logic: Arg parsing needs to happen in Interpreter to split by comma safely.

        if (args.length < 2) return "";
        const [a, b, ifTrue, ifFalse] = args;

        return a === b ? (ifTrue || "true") : (ifFalse || "false");
    }
}
