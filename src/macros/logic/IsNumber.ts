import { Macro } from "../Macro";

export class IsNumberMacro extends Macro {
    constructor() {
        super({ name: "isNumber", category: "logic" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return (!isNaN(parseFloat(args[0])) && isFinite(parseFloat(args[0]))).toString();
    }
}
