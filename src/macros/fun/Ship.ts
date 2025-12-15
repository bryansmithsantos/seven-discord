import { Macro } from "../Macro";

export class ShipMacro extends Macro {
    constructor() {
        super({
            name: "ship",
            description: "Calculates love percentage.",
            usage: "s.ship[user1; user2]",
            example: "s.ship[Romeu; Julieta]",
            category: "fun"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const u1 = args[0] || "You";
        const u2 = args[1] || "Me";

        // Deterministic random based on names so it stays same for same pair
        const combined = (u1 + u2).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const percent = combined % 101;

        let msg = "";
        if (percent < 20) msg = "💔 awful match...";
        else if (percent < 50) msg = "😐 meh...";
        else if (percent < 80) msg = "❤️ good match!";
        else msg = "💖 SOULMATES!";

        return `${u1} ❤️ ${u2} = **${percent}%**\n${msg}`;
    }
}
