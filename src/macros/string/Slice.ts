import { Macro } from "../Macro";

export class SliceMacro extends Macro {
    constructor() {
        super({ name: "slice", category: "string" });
    }

    async execute(ctx: any, ...args: string[]): Promise<string> {
        const start = parseInt(args[1]) || 0;
        const end = args[2] ? parseInt(args[2]) : undefined;
        return args[0].slice(start, end);
    }
}
