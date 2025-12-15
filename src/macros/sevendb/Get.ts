import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class GetMacro extends Macro {
    constructor() {
        super("s.db.get", "Get a value from Native DB", [
            { name: "key", type: "string" }
        ]);
    }

    public async execute(ctx: ExecutionContext, key: string): Promise<string> {
        if (!key) return "";
        const val = ctx.client.db.get(key);
        return val !== null ? String(val) : "";
    }
}
