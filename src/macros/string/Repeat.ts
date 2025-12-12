import { Macro } from "../Macro";

export class RepeatMacro extends Macro {
    constructor() {
        super({ name: "repeat", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const count = parseInt(args[1]) || 1;
        return args[0].repeat(count);
    }
}
