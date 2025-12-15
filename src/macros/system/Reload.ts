import { SevenClient } from "../../core/SevenClient";
import { Macro, MacroOptions } from "../Macro";

export interface ReloadMacroOptions extends MacroOptions { }

export class ReloadMacro extends Macro {
    constructor() {
        super({
            name: "s.reload",
            description: "Reloads all commands.",
            category: "System",
            usage: "s.reload",
            example: "s.reload"
        });
    }

    async execute(client: SevenClient, payload: any): Promise<string> {
        try {
            client.reloadCommands();
            return "✅ Commands reloaded successfully!";
        } catch (e: any) {
            return `❌ Failed to reload: ${e.message}`;
        }
    }
}
