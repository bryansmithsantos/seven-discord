import { spawn } from "child_process";
import path from "path";
import { Logger } from "../util/Logger";

export class ShardingManager {
    public file: string;
    public totalShards: number | "auto";
    public shards: Map<number, any> = new Map();

    constructor(file: string, options: { totalShards?: number | "auto" } = {}) {
        this.file = file;
        this.totalShards = options.totalShards || "auto";
    }

    public spawn() {
        if (this.totalShards === "auto") {
            this.totalShards = require("os").cpus().length;
        }

        Logger.info(`[Sharding] Spawning ${this.totalShards} shards...`);

        for (let i = 0; i < (this.totalShards as number); i++) {
            this.createShard(i);
        }
    }

    private createShard(id: number) {
        Logger.info(`[Sharding] Launching Shard ${id}...`);

        const child = spawn("bun", [this.file], {
            env: { ...process.env, SHARD_ID: String(id), TOTAL_SHARDS: String(this.totalShards) },
            stdio: "inherit"
        });

        this.shards.set(id, child);

        child.on("close", (code) => {
            Logger.warn(`[Sharding] Shard ${id} died with code ${code}. Respawning in 5s...`);
            setTimeout(() => this.createShard(id), 5000);
        });
    }
}
