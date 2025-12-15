import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class GetMacro extends Macro {
    constructor() {
        super({
            name: "s.db.get",
            description: "Get a value from Native DB",
            category: "sevendb"
        });
    }

    public async execute(ctx: ExecutionContext, key: string): Promise<string> {
        if (!key) return "";
        const val = ctx.client.db.get(key);
        return val !== null ? String(val) : "";
    }
}
