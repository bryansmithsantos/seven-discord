import { Macro } from "../Macro";

// --- CREATE MODAL (Simplifies s.modal) ---
export class CreateModalMacro extends Macro {
    constructor() { super({ name: "createModal", description: "Easy Modal creation", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) {
        // Usage: s.createModal[CustomID; Title; InputLabel]
        // Defaults to Short Input style
        const [id, title, label] = args;
        const modal = {
            title: title || "Modal",
            custom_id: id,
            components: [{
                type: 1, // Action Row
                components: [{
                    type: 4, // Text Input
                    custom_id: "input_0",
                    label: label || "Input",
                    style: 1 // Short
                }]
            }]
        };
        // Return JSON string for s.reply/send
        return JSON.stringify(modal);
    }
}

// --- CREATE SELECT (Simplifies s.selectMenu) ---
export class CreateSelectMacro extends Macro {
    constructor() { super({ name: "createSelect", description: "Easy Select Menu", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) {
        // Usage: s.createSelect[CustomID; Placeholder; Option1; Option2...]
        const [id, placeholder, ...options] = args;
        const select = {
            type: 1,
            components: [{
                type: 3, // String Select
                custom_id: id,
                placeholder: placeholder || "Select...",
                options: options.map(opt => ({ label: opt, value: opt }))
            }]
        };
        return JSON.stringify(select);
    }
}

// --- ON MODAL (Alias) ---
export class OnModalMacro extends Macro {
    constructor() { super({ name: "onModal", description: "Handle Modal submit", category: "ui" }); }
    async execute(ctx: any, ...args: string[]) {
        // Just an abstraction that stores like interactionCreate, but maybe specific?
        // For now, we reuse the pattern of SevenClient.eventCommands
        // BUT, s.onInteraction covers this. This is just syntactic sugar? 
        // Actually, we can't easily inject "listeners" dynamically at runtime inside a macro execution without a proper handler.
        // The standard pattern is client.on({ event: 'interactionCreate' }). 
        // This macro might just return empty or register to a temporary map if we built that.
        // For SAFETY in v2, we stick to recommending client.on().
        // BUT if user wants s.onModal in code...
        return ""; // Placeholder: Dynamic listeners are complex in this architecture.
    }
}
