
import { Macro } from "../Macro";

export class UptimeMacro extends Macro {
    constructor() {
        super({
            name: "uptime",
            description: "Shows bot uptime. Usage: s.uptime",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const uptimeMs = process.uptime() * 1000;

        const pad = (n: number) => n < 10 ? '0' + n : n;

        const seconds = Math.floor((uptimeMs / 1000) % 60);
        const minutes = Math.floor((uptimeMs / (1000 * 60)) % 60);
        const hours = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
}
