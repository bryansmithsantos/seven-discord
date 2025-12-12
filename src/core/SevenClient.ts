/**
 * SevenClient
 * The main entry point for the library.
 * Integrates Gateway, REST, and the Macro Interpreter.
 */

import { GatewayManager } from "../gateway/GatewayManager";
import { CommandConfig, EventConfig, Command } from "../structures/Command";
import { Logger } from "../util/Logger";
import { RESTManager } from "../rest/RESTManager";
import { Interpreter } from "../parser/Interpreter";
import { VariableManager } from "../managers/VariableManager";
import { Database } from "../core/Database";
import { EconomyManager } from "../managers/EconomyManager";
import { InteractionManager } from "../managers/InteractionManager";
import { SlashManager, SlashCommandOptions } from "../managers/SlashManager";

import { readdirSync } from "fs";
import { join } from "path";

export interface SevenClientOptions {
    token: string;
    prefix?: string;
    intents?: number | string[];
}

export class SevenClient {
    public gateway: GatewayManager;
    public rest: RESTManager;
    public token: string;
    public prefix: string;

    // Core Managers
    public commands: Map<string, Command> = new Map();
    public cooldowns: Map<string, number> = new Map(); // Key: userID-cmdName, Value: Expiration Timestamp
    public db: Database;
    public variables: VariableManager;
    public economy: EconomyManager;
    public interactions: InteractionManager;
    public slash: SlashManager;
    public interpreter: Interpreter;

    public user: any = null; // Store bot user info
    public sessionId: string | null = null;

    public get sevenvariables() {
        return this.variables;
    }


    constructor(options: SevenClientOptions) {
        this.token = options.token;
        this.prefix = options.prefix || "!";
        this.rest = new RESTManager(this.token);

        // Initialize Core Systems
        this.db = new Database();
        this.variables = new VariableManager(this.db);
        this.economy = new EconomyManager(this.variables);
        this.interactions = new InteractionManager(this.variables);
        this.slash = new SlashManager(this); // Init Slash
        this.interpreter = new Interpreter(this);

        // Gateway Init
        this.gateway = new GatewayManager(this.token);

        // Resolve Intents
        if (options.intents) {
            this.gateway.intents = this.resolveIntents(options.intents);
        } else {
            // Default: Guilds + Messages + MessageContent
            // 512 + 1 + 32768 = 33281 (Approx, using raw for now)
            this.gateway.intents = 3276799; // All intents (for simplicity in v2) or safe default
        }

        // Load Event Handlers
        this.registerInternalListeners();
    }

    /**
     * Resolve intents input to bitfield.
     */
    private resolveIntents(intents: number | string[]): number {
        if (typeof intents === "number") return intents;
        // Simple mapping for now, assuming user passes raw numbers or we add a map later
        // For v2.3 simplicity, we assume they pass a bitfield number if advanced, or we default to ALL.
        return 3276799; // Placeholder for full intent string parsing
    }

    /**
     * Load commands from a directory recursively.
     * @param dir The directory to load from
     */
    public loadCommands(dir: string): void {
        const fullPath = join(process.cwd(), dir);
        if (!require("fs").existsSync(fullPath)) {
            Logger.warn(`Command directory not found: ${dir}`);
            return;
        }

        const files = this.getFiles(fullPath);
        for (const file of files) {
            const cmd = require(file);
            // Support default export or named export
            const config = cmd.default || cmd;

            if (config?.name && config?.code) {
                this.cmd(config);
                Logger.load("command", config.name);
            }
        }
    }

    private getFiles(dir: string): string[] {
        let results: string[] = [];
        const list = readdirSync(dir);
        for (const file of list) {
            const filePath = join(dir, file);
            const stat = require("fs").statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(this.getFiles(filePath));
            } else {
                if (file.endsWith(".ts") || file.endsWith(".js")) {
                    results.push(filePath);
                }
            }
        }
        return results;
    }

    /**
     * Register a command using the Object-Config flow.
     */
    public cmd(config: CommandConfig): SevenClient {
        const cmdIndex = new Command(config);

        // Register Main Name
        this.commands.set(config.name.toLowerCase(), cmdIndex);
        Logger.debug(`Registered command: ${config.name}`);

        // Register Aliases
        if (config.aliases && config.aliases.length > 0) {
            for (const alias of config.aliases) {
                this.commands.set(alias.toLowerCase(), cmdIndex);
                Logger.debug(`Registered alias: ${alias} -> ${config.name}`);
            }
        }

        return this;
    }

    /**
     * Register a slash command.
     */
    public cmdSlash(config: SlashCommandOptions): SevenClient {
        Logger.debug(`Registered slash command: ${config.name}`);
        this.slash.register(config);
        // Add to internal slash sync queue if needed, or rely on manual sync? 
        // For simplicity, we sync on Ready?
        // Actually, user needs to know how to sync.
        return this;
    }

    public eventCommands: Map<string, EventConfig[]> = new Map();

    /**
     * Register an event listener.
     */
    public on(config: EventConfig): SevenClient {
        Logger.debug(`Registered event: ${config.event}`);

        const key = config.event.toLowerCase();
        if (!this.eventCommands.has(key)) {
            this.eventCommands.set(key, []);
        }
        this.eventCommands.get(key)?.push(config);

        return this;
    }

/**
 * Start the bot.
/**
 * SevenClient
 * The main entry point for the library.
 * Integrates Gateway, REST, and the Macro Interpreter.
 */

import { GatewayManager } from "../gateway/GatewayManager";
import { CommandConfig, EventConfig, Command } from "../structures/Command";
import { Logger } from "../util/Logger";
import { RESTManager } from "../rest/RESTManager";
import { Interpreter } from "../parser/Interpreter";
import { VariableManager } from "../managers/VariableManager";
import { Database } from "../core/Database";
import { EconomyManager } from "../managers/EconomyManager";
import { InteractionManager } from "../managers/InteractionManager";
import { SlashManager, SlashCommandOptions } from "../managers/SlashManager";

import { readdirSync } from "fs";
import { join } from "path";

export interface SevenClientOptions {
    token: string;
    prefix?: string;
    intents?: number | string[];
}

export class SevenClient {
    public gateway: GatewayManager;
    public rest: RESTManager;
    public token: string;
    public prefix: string;

    // Core Managers
    public commands: Map<string, Command> = new Map();
    public cooldowns: Map<string, number> = new Map(); // Key: userID-cmdName, Value: Expiration Timestamp
    public db: Database;
    public variables: VariableManager;
    public economy: EconomyManager;
    public interactions: InteractionManager;
    public slash: SlashManager;
    public interpreter: Interpreter;

    public user: any = null; // Store bot user info
    public sessionId: string | null = null;

    public get sevenvariables() {
        return this.variables;
    }


    constructor(options: SevenClientOptions) {
        this.token = options.token;
        this.prefix = options.prefix || "!";
        this.rest = new RESTManager(this.token);

        // Initialize Core Systems
        this.db = new Database();
        this.variables = new VariableManager(this.db);
        this.economy = new EconomyManager(this.variables);
        this.interactions = new InteractionManager(this.variables);
        this.slash = new SlashManager(this); // Init Slash
        this.interpreter = new Interpreter(this);

        // Gateway Init
        this.gateway = new GatewayManager(this.token);

        // Resolve Intents
        if (options.intents) {
            this.gateway.intents = this.resolveIntents(options.intents);
        } else {
            // Default: Guilds + Messages + MessageContent
            // 512 + 1 + 32768 = 33281 (Approx, using raw for now)
            this.gateway.intents = 3276799; // All intents (for simplicity in v2) or safe default
        }

        // Load Event Handlers
        this.registerInternalListeners();
    }

    /**
     * Resolve intents input to bitfield.
     */
    private resolveIntents(intents: number | string[]): number {
        if (typeof intents === "number") return intents;
        // Simple mapping for now, assuming user passes raw numbers or we add a map later
        // For v2.3 simplicity, we assume they pass a bitfield number if advanced, or we default to ALL.
        return 3276799; // Placeholder for full intent string parsing
    }

    /**
     * Load commands from a directory recursively.
     * @param dir The directory to load from
     */
    public loadCommands(dir: string): void {
        const fullPath = join(process.cwd(), dir);
        if (!require("fs").existsSync(fullPath)) {
            Logger.warn(`Command directory not found: ${dir}`);
            return;
        }

        const files = this.getFiles(fullPath);
        for (const file of files) {
            const cmd = require(file);
            // Support default export or named export
            const config = cmd.default || cmd;

            if (config?.name && config?.code) {
                this.cmd(config);
                Logger.load("command", config.name);
            }
        }
    }

    private getFiles(dir: string): string[] {
        let results: string[] = [];
        const list = readdirSync(dir);
        for (const file of list) {
            const filePath = join(dir, file);
            const stat = require("fs").statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(this.getFiles(filePath));
            } else {
                if (file.endsWith(".ts") || file.endsWith(".js")) {
                    results.push(filePath);
                }
            }
        }
        return results;
    }

    /**
     * Register a command using the Object-Config flow.
     */
    public cmd(config: CommandConfig): SevenClient {
        const cmdIndex = new Command(config);

        // Register Main Name
        this.commands.set(config.name.toLowerCase(), cmdIndex);
        Logger.debug(`Registered command: ${config.name}`);

        // Register Aliases
        if (config.aliases && config.aliases.length > 0) {
            for (const alias of config.aliases) {
                this.commands.set(alias.toLowerCase(), cmdIndex);
                Logger.debug(`Registered alias: ${alias} -> ${config.name}`);
            }
        }

        return this;
    }

    /**
     * Register a slash command.
     */
    public cmdSlash(config: SlashCommandOptions): SevenClient {
        Logger.debug(`Registered slash command: ${config.name}`);
        this.slash.register(config);
        // Add to internal slash sync queue if needed, or rely on manual sync? 
        // For simplicity, we sync on Ready?
        // Actually, user needs to know how to sync.
        return this;
    }

    public eventCommands: Map<string, EventConfig[]> = new Map();

    /**
     * Register an event listener.
     */
    public on(config: EventConfig): SevenClient {
        Logger.debug(`Registered event: ${config.event}`);

        const key = config.event.toLowerCase();
        if (!this.eventCommands.has(key)) {
            this.eventCommands.set(key, []);
        }
        this.eventCommands.get(key)?.push(config);

        return this;
    }

/**
 * Start the bot.
 */

/**
 * Set the bot's status and presence.
 * @param status "online" | "dnd" | "idle" | "invisible"
 * @param name Activity Name (e.g. "Playing Minecraft")
    private registerInternalListeners(): void {
        this.loadEvents();
    }

    private loadEvents(): void {
        const events = [
            new (require("../events/client/Ready").ReadyEvent)(),
            new (require("../events/client/UserUpdate").UserUpdateEvent)(),
            new (require("../events/guild/MessageCreate").MessageCreateEvent)(),
            new (require("../events/guild/MessageDelete").MessageDeleteEvent)(),
            new (require("../events/guild/MessageUpdate").MessageUpdateEvent)(),
            new (require("../events/guild/InteractionCreate").InteractionCreateEvent)(),
            new (require("../events/guild/GuildMemberAdd").GuildMemberAddEvent)(),
            new (require("../events/guild/GuildMemberRemove").GuildMemberRemoveEvent)(),
            new (require("../events/guild/GuildCreate").GuildCreateEvent)(),
            new (require("../events/guild/GuildDelete").GuildDeleteEvent)(),
            new (require("../events/guild/GuildUpdate").GuildUpdateEvent)(),
            new (require("../events/guild/GuildBanAdd").GuildBanAddEvent)(),
            new (require("../events/guild/GuildBanRemove").GuildBanRemoveEvent)(),
            new (require("../events/guild/RoleCreate").RoleCreateEvent)(),
            new (require("../events/guild/RoleDelete").RoleDeleteEvent)(),
            new (require("../events/guild/RoleUpdate").RoleUpdateEvent)(),
            new (require("../events/guild/ChannelCreate").ChannelCreateEvent)(),
            new (require("../events/guild/ChannelDelete").ChannelDeleteEvent)(),
            new (require("../events/guild/ChannelUpdate").ChannelUpdateEvent)(),
            new (require("../events/guild/VoiceStateUpdate").VoiceStateUpdateEvent)()
        ];

        // Global Dispatch Handler
        this.gateway.on("dispatch", (packet) => {
            if (packet.t === "READY") {
                this.sessionId = packet.d.session_id;
                this.user = packet.d.user;
                this.slash.sync().catch(e => { });
            }
            for (const event of events) {
                if (packet.t === event.name) {
                    event.execute(this, packet.d);
                }
            }
        });
    }
}
