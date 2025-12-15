import { Plugin } from "../structures/Plugin";
import { readdir } from "fs/promises";
import { join } from "path";

/**
 * Manages the loading and lifecycle of Plugins.
 */
export class PluginManager {
    private plugins: Map<string, Plugin> = new Map();
    private client: any; // Type as SevenClient eventually

    constructor(client: any) {
        this.client = client;
    }

    /**
     * Load a plugin from an object.
     * @param plugin The plugin object.
     */
    public load(plugin: Plugin) {
        if (this.plugins.has(plugin.name)) {
            console.warn(`[PluginManager] Plugin ${plugin.name} is already loaded.`);
            return;
        }

        console.log(`[PluginManager] Loading plugin: ${plugin.name} v${plugin.version}`);

        // Load Macros
        if (plugin.macros) {
            plugin.macros.forEach(macro => {
                this.client.macros.set(macro.name.toLowerCase(), macro);
                if (macro.aliases) {
                    macro.aliases.forEach(a => this.client.macros.set(a.toLowerCase(), macro));
                }
            });
        }

        // Load Commands
        if (plugin.commands) {
            plugin.commands.forEach(cmd => {
                this.client.cmd(cmd);
            });
        }

        // Trigger onLoad hook
        if (plugin.onLoad) {
            plugin.onLoad(this.client);
        }

        this.plugins.set(plugin.name, plugin);
    }

    /**
     * Load plugins from a directory.
     * @param dirPath Absolute path to plugins directory.
     */
    public async loadFromDir(dirPath: string) {
        try {
            const files = await readdir(dirPath);
            for (const file of files) {
                if (file.endsWith(".js") || file.endsWith(".ts")) {
                    const pluginModule = await import(join(dirPath, file));
                    const plugin = pluginModule.default || pluginModule;
                    if (plugin.name) {
                        this.load(plugin);
                    }
                }
            }
        } catch (error) {
            // Ignore error if dir doesn't exist
            // console.error(`[PluginManager] Error loading plugins from ${dirPath}:`, error);
        }
    }
}
