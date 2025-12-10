
import { Macro } from "../Macro";

export class TimeMacro extends Macro {
    constructor() {
        super({
            name: "time",
            description: "Returns the current time. Usage: s.time[Zone?]",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const zone = args[0] || "UTC";
        try {
            return new Date().toLocaleTimeString("en-US", { timeZone: zone, hour12: false });
        } catch (e) {
            return new Date().toISOString().split("T")[1].split(".")[0];
        }
    }
}
