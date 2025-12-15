import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class DeleteMacro extends Macro {
    constructor() {
        super("s.db.delete", "Delete a value from Native DB", [
            { name: "key", type: "string" }
        ]);
    }

    public async execute(ctx: ExecutionContext, key: string): Promise<void> {
        if (!key) return;
        ctx.client.db.delete(key);
    }
}
