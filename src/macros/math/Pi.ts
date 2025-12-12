import { Macro } from "../Macro";

export class PiMacro extends Macro {
    constructor() {
        super({ name: "pi", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return Math.PI.toString();
    }
}
