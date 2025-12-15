import { Macro } from "../Macro";

export class StopMacro extends Macro {
    constructor() {
        super({
            name: "stop",
            description: "Stops the audio player.",
            usage: "s.stop",
            example: "s.stop",
            category: "voice"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        // Stop logic
        return "true";
    }
}
