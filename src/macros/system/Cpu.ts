import { Macro } from "../Macro";
import * as os from "os";

export class CpuMacro extends Macro {
    constructor() {
        super({ name: "cpu", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return os.cpus()[0].model;
    }
}
