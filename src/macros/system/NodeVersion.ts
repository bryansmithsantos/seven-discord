import { Macro } from "../Macro";

export class NodeVersionMacro extends Macro {
    constructor() {
        super({ name: "nodeVersion", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return process.version;
    }
}
