import { Macro } from "../Macro";
import { ExecutionContext } from "../../parser/Interpreter";

export class SetMacro extends Macro {
    constructor() {
        super({
            name: "s.db.set",
            description: "Set a value in Native DB",
            category: "sevendb"
        });
    }

    public async execute(ctx: ExecutionContext, key: string, value: any): Promise<void> {
        if (!key) return;
        ctx.client.db.set(key, value);
    }
}
