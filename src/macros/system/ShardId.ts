import { Macro } from "../Macro";

export class ShardIdMacro extends Macro {
    constructor() {
        super({ name: "shardId", category: "system" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        return (ctx.client.shard?.ids[0] ?? 0).toString();
    }
}
