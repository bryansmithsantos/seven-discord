import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class SetMacro extends Macro {
    constructor() {
        super("s.db.set", "Set a value in Native DB", [
            { name: "key", type: "string" },
            { name: "value", type: "any" }
        ]);
    }

    public async execute(ctx: ExecutionContext, key: string, value: any): Promise<void> {
        if (!key) return;
        ctx.client.db.set(key, value);
    }
}
