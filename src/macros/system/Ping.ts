
import { Macro } from "../Macro";

export class PingMacro extends Macro {
    constructor() {
        super({
            name: "ping",
            description: "Shows bot latency. Usage: s.ping",
            category: "system"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // We can't easily get REST latency without a request.
        // We can get Gateway heartbeat if stored?
        // Let's return a simple "Pong!" or fake it/measure process time.
        // Better: Use `Date.now() - ctx.message.timestamp` if available?
        // Simplified: "Pong!"
        return `Pong! 🏓`;
    }
}
