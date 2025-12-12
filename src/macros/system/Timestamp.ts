import { Macro } from "../Macro";

export class TimestampMacro extends Macro {
    constructor() {
        super({ name: "timestamp", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return Date.now().toString();
    }
}
