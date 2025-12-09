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

export interface SevenClientOptions {
    token: string;
    prefix?: string;
}

export class SevenClient {
    public gateway: GatewayManager;
    public rest: RESTManager;
    public token: string;
    public prefix: string;

    // Core Managers
    public commands: Map<string, Command> = new Map();
    public db: Database;
    public variables: VariableManager;
    public economy: EconomyManager;
    public interactions: InteractionManager;
    public slash: SlashManager;
    public interpreter: Interpreter;

    public user: any = null; // Store bot user info
    public sessionId: string | null = null;

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

        // Load Event Handlers
        this.registerInternalListeners();
    }

    /**
     * Register a command using the Object-Config flow.
     */
    public cmd(config: CommandConfig): SevenClient {
        Logger.debug(`Registered command: ${config.name}`);
        this.commands.set(config.name.toLowerCase(), new Command(config));
        return this;
    }

    /**
     * Register a slash command.
     */
    public cmdSlash(config: SlashCommandOptions): SevenClient {
        Logger.debug(`Registered slash command: ${config.name}`);
        this.slash.register(config);
        return this;
    }

    /**
     * Register an event listener.
     */
    public on(config: EventConfig): SevenClient {
        Logger.debug(`Registered event: ${config.event}`);
        // Future: Add event macro handling here
        return this;
    }

    /**
     * Start the bot.
     */
    public start(): void {
        console.clear();
        Logger.info("Booting Seven-Discord...");

        console.log(`
   ███████╗███████╗██╗   ██╗███████╗███╗   ██╗
   ██╔════╝██╔════╝██║   ██║██╔════╝████╗  ██║
   ███████╗█████╗  ██║   ██║█████╗  ██╔██╗ ██║
   ╚════██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
   ███████║███████╗ ╚████╔╝ ███████╗██║ ╚████║
   ╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝
   v${require("../../package.json").version || "2.1.0"} | Engine: Bun | Database: Active
        `);

        Logger.info(`Loaded ${this.commands.size} commands.`);
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        Logger.debug(`Initial Memory Usage: ${ram} MB`);

        this.gateway.connect();
    }

    private registerInternalListeners(): void {
        this.loadEvents();
    }

    private loadEvents(): void {
        const events = [
            new (require("../events/client/Ready").ReadyEvent)(),
            new (require("../events/guild/MessageCreate").MessageCreateEvent)(),
            new (require("../events/guild/InteractionCreate").InteractionCreateEvent)()
        ];

        for (const event of events) {
            Logger.debug(`Loading event: ${event.name}`);
            this.gateway.on("dispatch", (packet) => {
                // Handle READY explicitly for session capture
                if (packet.t === "READY") {
                    this.sessionId = packet.d.session_id;
                    this.user = packet.d.user;
                    Logger.info(`Logged in as ${this.user.username}`);
                    // Sync Slash Commands
                    this.slash.sync();
                }

                if (packet.t === event.name) {
                    event.execute(this, packet.d);
                }
            });
        }
    }
}
