import { SlashCommandOptions, ApplicationCommandOption } from "../managers/SlashManager";

export class SlashCommandBuilder {
    private data: SlashCommandOptions;

    constructor() {
        this.data = {
            name: "",
            description: "No description provided",
            options: [],
            code: "" // Default empty code
        };
    }

    public setName(name: string): this {
        this.data.name = name;
        return this;
    }

    public setDescription(description: string): this {
        this.data.description = description;
        return this;
    }

    public setCode(code: string): this {
        this.data.code = code;
        return this;
    }

    public addStringOption(name: string, description: string, required: boolean = false): this {
        this.data.options?.push({
            name,
            description,
            type: 3, // STRING
            required
        });
        return this;
    }

    public addIntegerOption(name: string, description: string, required: boolean = false): this {
        this.data.options?.push({
            name,
            description,
            type: 4, // INTEGER
            required
        });
        return this;
    }

    public addBooleanOption(name: string, description: string, required: boolean = false): this {
        this.data.options?.push({
            name,
            description,
            type: 5, // BOOLEAN
            required
        });
        return this;
    }

    public addUserOption(name: string, description: string, required: boolean = false): this {
        this.data.options?.push({
            name,
            description,
            type: 6, // USER
            required
        });
        return this;
    }

    public addChannelOption(name: string, description: string, required: boolean = false): this {
        this.data.options?.push({
            name,
            description,
            type: 7, // CHANNEL
            required
        });
        return this;
    }

    public toJSON(): SlashCommandOptions {
        if (!this.data.name) throw new Error("Slash command must have a name.");
        return this.data;
    }
}
