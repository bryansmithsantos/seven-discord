import { Macro } from "../Macro";

export class HugMacro extends Macro {
    constructor() {
        super({
            name: "hug",
            description: "Hugs a user.",
            usage: "s.hug[user]",
            example: "s.hug[@user]",
            category: "fun"
        });
    }

    async execute(ctx: any, ...args: string[]) {
        const target = args[0];
        if (!target) return "Hug who?";

        // Simple array of GIFs
        const gifs = [
            "https://media.giphy.com/media/dummy_hug_1.gif",
            "https://media.giphy.com/media/dummy_hug_2.gif"
        ];
        // In a real version, we'd use a real API or curated list. 
        // For v2.5.25 "Native", we provide a placeholder or text art if images fail.

        return `🤗 **HUG!**\nYou hugged ${target}!`;
    }
}
