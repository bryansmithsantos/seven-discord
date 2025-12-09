
import { Macro } from "../Macro";

export class SetCurrencyMacro extends Macro {
    constructor() {
        super({
            name: "setCurrency",
            description: "Sets the economy symbol. Usage: s.setCurrency[symbol]",
            category: "economy"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const [symbol] = args;
        if (!symbol) return;

        ctx.client.economy.setSymbol(symbol);
        return symbol;
    }
}
