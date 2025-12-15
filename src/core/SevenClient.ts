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
import { SevenDB } from "../structures/SevenDB";
import { EconomyManager } from "../managers/EconomyManager";
import { LevelManager } from "../managers/LevelManager";
import { InteractionManager } from "../managers/InteractionManager";
import { SlashManager, SlashCommandOptions } from "../managers/SlashManager";
import { VoiceManager } from "../managers/VoiceManager";
import { MiddlewareManager } from "../structures/Middleware";
import { PluginManager } from "../managers/PluginManager";

import { readdirSync } from "fs";
import { join } from "path";
import { Intents, IntentFlag } from "../structures/Intents";

export interface SevenClientOptions {
    token: string;
    prefix?: string;
    intents?: number | IntentFlag[];
}

export class SevenClient {
    public gateway: GatewayManager;
    public rest: RESTManager;
    public token: string;
    public prefix: string;

    // Core Managers
    public commands: Map<string, Command> = new Map();
    public cooldowns: Map<string, number> = new Map();
    public db: SevenDB;
    public variables: VariableManager;
    public economy: EconomyManager;
    public levels: LevelManager;
    public interactions: InteractionManager;
    public slash: SlashManager;
    public interpreter: Interpreter;
    public voice: VoiceManager;

    public middleware: MiddlewareManager;
    public plugins: PluginManager;

    public user: any = null; // Store bot user info
    public sessionId: string | null = null;
    public readyCommand: string | null = null;

    public get sevenvariables() {
        return this.variables;
    }

    constructor(options: SevenClientOptions) {
        this.token = options.token;
        this.prefix = options.prefix || "!";
        this.rest = new RESTManager(this.token);

        // Initialize Core Systems
        this.db = new SevenDB();
        this.variables = new VariableManager(this.db);
        this.economy = new EconomyManager(this.variables);
        this.levels = new LevelManager(this.variables);
        this.interactions = new InteractionManager(this.variables);
        this.slash = new SlashManager(this);
        this.interpreter = new Interpreter(this);
        this.levels = new LevelManager(this.variables);
        this.interactions = new InteractionManager(this.variables);
        this.slash = new SlashManager(this);
        this.interpreter = new Interpreter(this);
        this.voice = new VoiceManager(this);

        // v2.6.0 Systems
        this.middleware = new MiddlewareManager();
        this.plugins = new PluginManager(this);

        // Gateway Init
        this.gateway = new GatewayManager(this.token);

        // Resolve Intents
        if (options.intents) {
            this.gateway.intents = this.resolveIntents(options.intents);
        } else {
            this.gateway.intents = 3276799;
        }

        // Load Event Handlers
        this.registerInternalListeners();
    }

    private resolveIntents(intents: number | IntentFlag[]): number {
        if (typeof intents === "number") return intents;
        if (Array.isArray(intents)) {
            let bitfield = 0;
            for (const intent of intents) {
                if (Intents[intent]) {
                    bitfield |= Intents[intent];
                } else {
                    Logger.warn(`Unknown intent: ${intent}`);
                }
            }
            return bitfield;
        }
        return Intents.SevenAll;
    }

    public commandDir: string | null = null;
    public pluginDir: string | null = null;

    public loadCommands(dir: string): void {
        this.commandDir = dir;
        const fullPath = join(process.cwd(), dir);
        if (!require("fs").existsSync(fullPath)) {
            Logger.warn(`Command directory not found: ${dir}`);
            return;
        }

        const files = this.getFiles(fullPath);
        for (const file of files) {
            delete require.cache[require.resolve(file)]; // Ensure fresh load
            const cmd = require(file);
            const config = cmd.default || cmd;

            if (config?.name && config?.code) {
                this.cmd(config);
                Logger.load("command", config.name);
            }
        }
    }

    public reloadCommands(): void {
        if (!this.commandDir) return;
        Logger.info("Reloading commands...");
        this.commands.clear();
        this.loadCommands(this.commandDir);
        Logger.success("Commands reloaded!");
    }

    public async loadPlugins(dir: string): Promise<void> {
        this.pluginDir = dir;
        const fullPath = join(process.cwd(), dir);
        if (!require("fs").existsSync(fullPath)) {
            // Plugins dir is optional, so just return
            return;
        }
        await this.plugins.loadFromDir(fullPath);
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

    public cmd(config: CommandConfig): SevenClient {
        const cmdIndex = new Command(config);
        this.commands.set(config.name.toLowerCase(), cmdIndex);
        Logger.debug(`Registered command: ${config.name}`);

        if (config.aliases && config.aliases.length > 0) {
            for (const alias of config.aliases) {
                this.commands.set(alias.toLowerCase(), cmdIndex);
                Logger.debug(`Registered alias: ${alias} -> ${config.name}`);
            }
        }
        return this;
    }

    public cmdSlash(config: SlashCommandOptions): SevenClient {
        Logger.debug(`Registered slash command: ${config.name}`);
        this.slash.register(config);
        return this;
    }

    public eventCommands: Map<string, EventConfig[]> = new Map();

    public on(config: EventConfig): SevenClient {
        Logger.debug(`Registered event: ${config.event}`);
        const key = config.event.toLowerCase();
        if (!this.eventCommands.has(key)) {
            this.eventCommands.set(key, []);
        }
        this.eventCommands.get(key)?.push(config);
        return this;
    }

    public setReady(code: string): SevenClient {
        this.readyCommand = code;
        return this;
    }

    public setStatus(status: string = "online", name: string = "Seven-Discord", type: number = 0): void {
        this.gateway.setPresence(status, name, type);
    }

    public setActivity(name: string, type: number = 0, status: string = "online"): void {
        this.setStatus(status, name, type);
    }

    public async start(): Promise<void> {
        console.clear();
        const currentVersion = require("../../package.json").version || "Dev";

        // Check for updates
        let updateMsg = "";
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const res = await fetch("https://registry.npmjs.org/seven-discord/latest", { signal: controller.signal });
            clearTimeout(timeoutId);

            const data = await res.json() as any;
            if (data.version && data.version !== currentVersion) {
                // Extravagant Warning
                updateMsg = `
    \x1b[41m\x1b[37m 🚨 CRITICAL UPDATE AVAILABLE: v${data.version} 🚨 \x1b[0m
    \x1b[31m╔══════════════════════════════════════════════════╗
    ║                                                  ║
    ║  YOUR VERSION IS OUTDATED! (v${currentVersion})             ║
    ║  RISK OF BUGS, CRASHES, AND SECURITY FLAWS.      ║
    ║                                                  ║
    ║  >>> npm update seven-discord                    ║
    ║                                                  ║
    ╚══════════════════════════════════════════════════╝\x1b[0m`;
            }
        } catch (e) { }

        // Premium Banner
        console.log(`\x1b[36m
    ███████╗███████╗██╗   ██╗███████╗███╗   ██╗
    ██╔════╝██╔════╝██║   ██║██╔════╝████╗  ██║
    ███████╗█████╗  ██║   ██║█████╗  ██╔██╗ ██║
    ╚════██║██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
    ███████║███████╗ ╚████╔╝ ███████╗██║ ╚████║
    ╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝ \x1b[0m
    \x1b[90m----------------------------------------\x1b[0m
    \x1b[37mTarget    \x1b[0m:: \x1b[32mBun Native\x1b[0m
    \x1b[37mVersion   \x1b[0m:: \x1b[35mv${currentVersion}\x1b[0m
    \x1b[37mCommands  \x1b[0m:: \x1b[34m${this.commands.size}\x1b[0m
    \x1b[37mParams    \x1b[0m:: [Prefix: '${this.prefix}']
    \x1b[90m----------------------------------------\x1b[0m${updateMsg}
        `);

        Logger.info("Initializing Gateway Connection...");
        this.gateway.connect();
    }

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
            new (require("../events/guild/VoiceStateUpdate").VoiceStateUpdateEvent)(),
            new (require("../events/guild/VoiceServerUpdate").VoiceServerUpdateEvent)()
        ];

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
