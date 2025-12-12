import { Macro } from "../Macro";

export class NotMacro extends Macro {
    constructor() {
        super({ name: "not", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const cond = args[0] === "true";
        return (!cond).toString();
    }
}
