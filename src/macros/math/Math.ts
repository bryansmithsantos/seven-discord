
import { Macro } from "../Macro";

export class MathMacro extends Macro {
    constructor() {
        super({
            name: "s.math",
            description: "Calculate a math expression.",
            category: "math"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        // Unsafe eval for math is risky, but for Seven's simplicity we might use it or a restricted parser.
        const expr = (args[0] || "").replace(/[^0-9+\-*/().]/g, '');
        try {
            return String(eval(expr));
        } catch {
            return "0";
        }
    }
}
