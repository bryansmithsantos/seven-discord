import { Macro } from "../Macro";

export class DateMacro extends Macro {
    constructor() {
        super({ name: "date", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return new Date().toLocaleDateString();
    }
}
