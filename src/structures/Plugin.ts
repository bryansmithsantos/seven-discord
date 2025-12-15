import { Macro } from "../macros/Macro";
import { CommandConfig } from "./Command";

/**
 * Interface representing a Seven-Discord Plugin.
 */
export interface Plugin {
    name: string;
    version: string;
    description?: string;
    author?: string;

    /**
     * Macros provided by this plugin.
     */
    macros?: Macro[];

    /**
     * Commands provided by this plugin.
     */
    commands?: CommandConfig[];

    /**
     * Events to listen to.
     */
    events?: {
        name: string;
        once?: boolean;
        code: string;
    }[];

    /**
     * Called when the plugin is loaded.
     */
    onLoad?: (client: any) => void;
}
