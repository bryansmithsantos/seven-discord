import { Macro } from "../Macro";

export class RandomIntMacro extends Macro {
    constructor() {
        super({ name: "randomInt", category: "math" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const min = parseInt(args[0]);
        const max = parseInt(args[1]);
        if (isNaN(min) || isNaN(max)) return "0";
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
}
