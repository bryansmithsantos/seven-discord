import { VariableManager } from "./VariableManager";

export class LevelManager {
    private vars: VariableManager;

    constructor(vars: VariableManager) {
        this.vars = vars;
    }

    private getKey(guildId: string, userId: string): string {
        return `lvl_xp_${guildId}_${userId}`;
    }

    public getXp(guildId: string, userId: string): number {
        return parseInt(this.vars.get(this.getKey(guildId, userId), "global") || "0");
    }

    public setXp(guildId: string, userId: string, amount: number): void {
        this.vars.set(this.getKey(guildId, userId), amount, "global");
    }

    public addXp(guildId: string, userId: string, amount: number): number {
        const current = this.getXp(guildId, userId);
        const newXp = current + amount;
        this.setXp(guildId, userId, newXp);
        return newXp;
    }

    public getLevel(xp: number): number {
        // Simple formula: Level = 0.1 * sqrt(XP)
        return Math.floor(0.1 * Math.sqrt(xp));
    }

    public xpForLevel(level: number): number {
        return Math.pow(level / 0.1, 2);
    }
}
