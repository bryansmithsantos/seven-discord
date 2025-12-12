import { Macro } from "../Macro";

export class ReverseMacro extends Macro {
    constructor() {
        super({ name: "reverse", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].split("").reverse().join("");
    }
}
