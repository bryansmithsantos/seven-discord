/**
 * Command Interface
 * Defines how a user configures a verified command.
 */

import { MiddlewareFunction } from "./Middleware";

export interface CommandConfig {
    /**
     * The name of the command (trigger).
     * Example: "ping" for s.ping
     */
    name: string;

    /**
     * Description for documentation/help command.
     */
    description?: string;

    /**
     * Aliases for the command.
     */
    aliases?: string[];

    /**
     * Middleware Guards.
     * "Only run if these pass".
     */
    only?: MiddlewareFunction[];

    /**
     * The logic code using "s." syntax.
     * Example: "Pong! s.pingms"
     */
    code: string;

    /**
     * Cooldown in seconds.
     */
    cooldown?: number;
}

export class Command {
    public name: string;
    public code: string;
    public aliases: string[] = [];
    public description: string = "";
    public cooldown: number = 0;

    constructor(config: CommandConfig) {
        this.name = config.name;
        this.code = config.code;
        this.aliases = config.aliases || [];
        this.description = config.description || "";
        this.cooldown = config.cooldown || 0;
    }
}

export interface EventConfig {
    /**
     * The event name (e.g., "ready", "messageCreate")
     */
    event: string;

    /**
     * The logic code.
     */
    code: string;
}
