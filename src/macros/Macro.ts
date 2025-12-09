
export interface MacroOptions {
    name: string;
    aliases?: string[];
    description?: string;
    category?: string; // 'core', 'moderation', 'logic'
    disableNestedParsing?: boolean; // If true, arguments are not parsed before execution
}

export abstract class Macro {
    public name: string;
    public aliases: string[];
    public description: string;
    public category: string;
    public disableNestedParsing: boolean;

    constructor(options: MacroOptions) {
        this.name = options.name;
        this.aliases = options.aliases || [];
        this.description = options.description || "No description provided.";
        this.category = options.category || "misc";
        this.disableNestedParsing = options.disableNestedParsing || false;
    }

    /**
     * Executes the macro logic.
     * @param context The context of the execution (client, message, etc)
     * @param args The arguments passed inside the macro brackets [arg1, arg2]
     */
    abstract execute(context: any, ...args: string[]): Promise<string | void> | string | void;
}
