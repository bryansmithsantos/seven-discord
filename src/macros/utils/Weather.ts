import { Macro } from "../Macro";

export class WeatherMacro extends Macro {
    constructor() {
        super({
            name: "weather",
            description: "Check weather (wttr.in).",
            usage: "s.weather[city]",
            example: "s.weather[London]",
            category: "utils"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const city = args[0];
        if (!city) return "City?";

        try {
            const res = await fetch(`https://wttr.in/${city}?format=%C+%t&m`);
            const txt = await res.text();
            return `Weather in ${city}: ${txt}`;
        } catch (e) {
            return "Error fetching weather.";
        }
    }
}
