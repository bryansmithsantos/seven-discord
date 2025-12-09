
import { SevenClient } from "../core/SevenClient";
import { Logger } from "../util/Logger";

export interface ApplicationCommandOption {
    type: number; // 3=STRING, 4=INTEGER, etc.
    name: string;
    description: string;
    required?: boolean;
    choices?: { name: string; value: any }[];
    options?: ApplicationCommandOption[]; // Sub-options
}

export interface SlashCommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    code: string; // The macro code to execute
}

export class SlashManager {
    public commands: Map<string, SlashCommandOptions> = new Map();
    private client: SevenClient;

    constructor(client: SevenClient) {
        this.client = client;
    }

    public register(options: SlashCommandOptions) {
        this.commands.set(options.name, options);
    }

    public async sync() {
        if (!this.client.token) return;
        const cmds = Array.from(this.commands.values()).map(c => ({
            name: c.name,
            description: c.description,
            options: c.options
        }));

        Logger.info(`Syncing ${cmds.length} slash commands...`);
        // Uses client.rest to PUT /applications/:id/commands
        try {
            // Need application ID. Usually client.user.id after login.
            // But sync might run before login? Or after ready?
            // Safer to run AFTER ready.
            if (!this.client.user?.id) {
                Logger.warn("Cannot sync slash commands: Bot not ready (no ID).");
                return;
            }

            await this.client.rest.put(
                `/applications/${this.client.user.id}/commands`,
                cmds
            );
            Logger.info("Slash commands synced successfully!");
        } catch (e: any) {
            Logger.error(`Failed to sync slash commands: ${e.message}`);
        }
    }
}
