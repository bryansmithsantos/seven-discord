import { Macro } from "../Macro";
import * as os from "os";

export class RamMacro extends Macro {
    constructor() {
        super({ name: "ram", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const used = process.memoryUsage().rss / 1024 / 1024;
        const total = os.totalmem() / 1024 / 1024;
        return `${used.toFixed(2)}MB / ${total.toFixed(2)}MB`;
    }
}
