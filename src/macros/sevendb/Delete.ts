import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class DeleteMacro extends Macro {
    constructor() {
        super({
            name: "s.db.delete",
            description: "Delete a value from Native DB",
            category: "sevendb"
        });
    }

    public async execute(ctx: ExecutionContext, key: string): Promise<void> {
        if (!key) return;
        ctx.client.db.delete(key);
    }
}
