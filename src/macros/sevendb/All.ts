import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class AllMacro extends Macro {
    constructor() {
        super("s.db.all", "Get all values from Native DB", []);
    }

    public async execute(ctx: ExecutionContext): Promise<string> {
        const all = ctx.client.db.all();
        return JSON.stringify(all);
    }
}
