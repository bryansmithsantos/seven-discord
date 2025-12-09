
import { Macro } from "../Macro";
import { inspect } from "util";

export class EvalMacro extends Macro {
    constructor() {
        super({
            name: "eval",
            description: "Executes JavaScript code. DANGEROUS. Usage: s.eval[code]",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const code = args.join(";"); // Rejoin if split by interpreter

        // Eval needs access to context
        const message = ctx.message;
        const interaction = ctx.interaction;
        const client = ctx.client;

        try {
            let evaled = await eval(code);
            if (typeof evaled !== "string") evaled = inspect(evaled);

            return `\`\`\`js\n${evaled}\n\`\`\``;
        } catch (e) {
            return `\`\`\`js\nError: ${e}\n\`\`\``;
        }
    }
}
