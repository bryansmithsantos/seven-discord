
import { Logger } from "../util/Logger";
import * as fs from "fs";

export class Database {
    private path: string;
    private data: Record<string, any> = {};
    private lastSave: number = Date.now();

    constructor(path: string = "seven_db.json") {
        this.path = path;
        this.load();

        // Auto-save every 60 seconds
        setInterval(() => this.save(), 60000);
    }

    public set(key: string, value: any) {
        this.data[key] = value;
        this.save(); // Save immediately for reliability
    }

    public get(key: string): any {
        return this.data[key];
    }

    public delete(key: string) {
        delete this.data[key];
    }

    public has(key: string): boolean {
        return Object.prototype.hasOwnProperty.call(this.data, key);
    }

    public save() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
            // Logger.debug("Database saved."); // Too spammy
        } catch (e) {
            Logger.error(`Failed to save database: ${e}`);
        }
    }

    public load() {
        if (!fs.existsSync(this.path)) {
            this.data = {};
            return;
        }
        try {
            const raw = fs.readFileSync(this.path, "utf-8");
            this.data = JSON.parse(raw);
            Logger.info("Database loaded successfully.");
        } catch (e) {
            Logger.error(`Failed to load database: ${e}`);
            this.data = {};
        }
    }
}
