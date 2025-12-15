import { Database } from "bun:sqlite";
import { Logger } from "../util/Logger";
import { join } from "path";
import fs from "fs";

export class SevenDB {
    private db: Database;
    private tableName: string;

    constructor(options: { path?: string; tableName?: string } = {}) {
        const dbPath = options.path || join(process.cwd(), "database.sqlite");
        this.tableName = options.tableName || "sevendb";

        this.db = new Database(dbPath);
        this.init();
    }

    private init() {
        this.db.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (key TEXT PRIMARY KEY, value TEXT)`);
    }

    /**
     * Set a value in the database.
     * @param key The key.
     * @param value The value (will be JSON stringified).
     */
    public set(key: string, value: any): void {
        const strVal = JSON.stringify(value);
        this.db.run(`INSERT OR REPLACE INTO ${this.tableName} (key, value) VALUES (?, ?)`, [key, strVal]);
    }

    /**
     * Get a value from the database.
     * @param key The key.
     * @returns The parsed value or null.
     */
    public get<T>(key: string): T | null {
        const row = this.db.query(`SELECT value FROM ${this.tableName} WHERE key = ?`).get(key) as any;
        if (!row) return null;
        try {
            return JSON.parse(row.value);
        } catch (e) {
            return null;
        }
    }

    /**
     * Delete a key.
     * @param key The key to delete.
     */
    public delete(key: string): void {
        this.db.run(`DELETE FROM ${this.tableName} WHERE key = ?`, [key]);
    }

    /**
     * Get all data.
     */
    public all(): Record<string, any> {
        const rows = this.db.query(`SELECT * FROM ${this.tableName}`).all() as any[];
        const result: Record<string, any> = {};
        for (const row of rows) {
            try {
                result[row.key] = JSON.parse(row.value);
            } catch (e) {
                // ignore invalid json
            }
        }
        return result;
    }

    /**
     * Clear the database.
     */
    public clear(): void {
        this.db.run(`DELETE FROM ${this.tableName}`);
    }
}
