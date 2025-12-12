import { Macro } from "../Macro";
import * as os from "os";

export class OsMacro extends Macro {
    constructor() {
        super({ name: "os", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return `${os.type()} ${os.release()} (${os.arch()})`;
    }
}
