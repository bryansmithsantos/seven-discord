import { Logger } from "../util/Logger";

const REGISTRY_URL = "https://raw.githubusercontent.com/Seven-Discord/registry/main/plugins.json";

export interface RegistryPackage {
    name: string;
    description: string;
    version: string;
    url: string; // github url or npm package name
}

export class RegistryManager {
    public static async search(query: string): Promise<RegistryPackage[]> {
        try {
            // Mock registry for now until repo exists
            const mockRegistry: RegistryPackage[] = [
                { name: "seven-economy", description: "Advanced economy system", version: "1.0.0", url: "seven-economy" },
                { name: "seven-dashboard", description: "Web dashboard plugin", version: "1.0.0", url: "seven-dashboard" },
                { name: "seven-music", description: "Music player plugin", version: "2.0.0", url: "seven-music" }
            ];

            return mockRegistry.filter(p => p.name.includes(query) || p.description.includes(query));
        } catch (e) {
            Logger.error("Failed to fetch registry.");
            return [];
        }
    }

    public static async install(packageName: string): Promise<boolean> {
        Logger.info(`Installing ${packageName}...`);

        // Use bun to add the package
        const proc = Bun.spawn(["bun", "add", packageName], {
            cwd: process.cwd(),
            stdout: "inherit",
            stderr: "inherit"
        });

        await proc.exited;
        return proc.exitCode === 0;
    }
}
