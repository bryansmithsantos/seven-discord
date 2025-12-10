
import { Macro } from "../Macro";

export class RandomMacro extends Macro {
    constructor() {
        super({
            name: "s.random",
            description: "Get a random number.",
            category: "math"
        });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const min = parseInt(args[0]) || 0;
        const max = parseInt(args[1]) || 100;
        return String(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
