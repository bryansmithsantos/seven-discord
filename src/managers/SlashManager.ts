
import { SevenClient } from "../core/SevenClient";
import { Logger } from "../util/Logger";

export interface ApplicationCommandOption {
    type: number; // 3=STRING, 4=INTEGER, etc.
    name: string;
    description: string;
    required?: boolean;
    choices?: { name: string; value: any }[];
    options?: ApplicationCommandOption[]; // Nested options
}

export interface SlashCommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    code: string;
}

export class SlashManager {
    public commands: Map<string, SlashCommandOptions> = new Map();
    private client: SevenClient;
    private synced: boolean = false;

    constructor(client: SevenClient) {
        this.client = client;
    }

    /**
     * Register a new Slash Command (Local)
     */
    public register(options: SlashCommandOptions | any) {
        // Support SlashCommandBuilder (.toJSON() or direct data)
        if (options.toJSON) {
            options = options.toJSON();
        }

        if (!options.name) throw new Error("Slash Command Name is required.");
        if (!options.description) options.description = "No description provided.";

        // Validation: Name must be lowercase
        if (options.name !== options.name.toLowerCase()) {
            Logger.warn(`[Slash] Auto-lowercasing command name: ${options.name}`);
            options.name = options.name.toLowerCase();
        }

        this.commands.set(options.name, options);
    }

    /**
     * Get a registered command
     */
    public get(name: string) {
        return this.commands.get(name);
    }

    /**
     * Sync commands with Discord API
     */
    public async sync() {
        if (!this.client.token) return;
        if (this.synced) return; // Prevent double syncing

        const cmds = Array.from(this.commands.values()).map(c => ({
            name: c.name,
            description: c.description,
            options: c.options
        }));

        Logger.info(`[Slash] Syncing ${cmds.length} commands with Discord...`);

        try {
            // Retry logic for ready state
            let attempts = 0;
            while (!this.client.user?.id && attempts < 10) {
                await new Promise(r => setTimeout(r, 500));
                attempts++;
            }

            if (!this.client.user?.id) {
                Logger.warn("[Slash] Failed to sync: Client not ready after retries.");
                return;
            }

            // PUT /applications/:id/commands (Global Update)
            await this.client.rest.put(
                `/applications/${this.client.user.id}/commands`,
                cmds
            );

            this.synced = true;
            Logger.success(`[Slash] Successfully synced ${cmds.length} commands!`);
        } catch (e: any) {
            Logger.error(`[Slash] Sync Failed: ${e.message}`);
            if (e.response) Logger.error(JSON.stringify(e.response));
        }
    }
}
