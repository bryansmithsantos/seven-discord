
import { Macro } from "../Macro";
import { Logger } from "../../util/Logger";

export class LogMacro extends Macro {
    constructor() {
        super({
            name: "log",
            description: "Logs a message to the console.",
            category: "core"
        });
    }

    execute(ctx: any, content: string) {
        Logger.info(`[MACRO LOG] ${content}`);
    }
}
