import { Macro } from "../Macro";

export class IncludesMacro extends Macro {
    constructor() {
        super({ name: "includes", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return args[0].includes(args[1]).toString();
    }
}
