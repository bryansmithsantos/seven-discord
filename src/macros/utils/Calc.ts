import { Macro } from "../Macro";

export class CalcMacro extends Macro {
    constructor() {
        super({
            name: "calc",
            description: "Evaluates a math expression.",
            usage: "s.calc[expr]",
            example: "s.calc[2 + 2]",
            category: "utils"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const expr = args[0];
        if (!expr) return "false";

        try {
            // Sanitize: only allow numbers and math ops
            if (/[^0-9+\-*/().\s]/.test(expr)) return "Invalid expression";

            // Safe helper function
            const result = new Function(`return ${expr}`)();
            return String(result);
        } catch (e) {
            return "Error";
        }
    }
}
