
import { VariableManager } from "./VariableManager";

export class EconomyManager {
    private vars: VariableManager;
    private symbol: string = "$";

    constructor(vars: VariableManager) {
        this.vars = vars;
    }

    private getKey(guildId: string, userId: string): string {
        return `eco_bal_${guildId}_${userId}`;
    }

    public getBalance(guildId: string, userId: string): number {
        const val = this.vars.get(this.getKey(guildId, userId), "global"); // Stored globally but key has guildId
        return parseInt(val || "0");
    }

    public setBalance(guildId: string, userId: string, amount: number): void {
        this.vars.set(this.getKey(guildId, userId), amount, "global");
    }

    public add(guildId: string, userId: string, amount: number): number {
        const current = this.getBalance(guildId, userId);
        const newBal = current + amount;
        this.setBalance(guildId, userId, newBal);
        return newBal;
    }

    public remove(guildId: string, userId: string, amount: number): number {
        const current = this.getBalance(guildId, userId);
        const newBal = Math.max(0, current - amount); // No debt for simplicity
        this.setBalance(guildId, userId, newBal);
        return newBal;
    }

    public transfer(guildId: string, fromUser: string, toUser: string, amount: number): boolean {
        const balFrom = this.getBalance(guildId, fromUser);
        if (balFrom < amount) return false;

        this.remove(guildId, fromUser, amount);
        this.add(guildId, toUser, amount);
        return true;
    }

    public setSymbol(sym: string) {
        this.symbol = sym;
    }

    public getSymbol(): string {
        return this.symbol;
    }

    // --- BANKING SYSTEM ---

    private getBankKey(guildId: string, userId: string): string {
        return `eco_bank_${guildId}_${userId}`;
    }

    public getBankBalance(guildId: string, userId: string): number {
        const val = this.vars.get(this.getBankKey(guildId, userId), "global");
        return parseInt(val || "0");
    }

    public setBankBalance(guildId: string, userId: string, amount: number): void {
        this.vars.set(this.getBankKey(guildId, userId), amount, "global");
    }

    public deposit(guildId: string, userId: string, amount: number): boolean {
        const cash = this.getBalance(guildId, userId);
        if (cash < amount) return false;

        this.remove(guildId, userId, amount);
        const bank = this.getBankBalance(guildId, userId);
        this.setBankBalance(guildId, userId, bank + amount);
        return true;
    }

    public withdraw(guildId: string, userId: string, amount: number): boolean {
        const bank = this.getBankBalance(guildId, userId);
        if (bank < amount) return false;

        this.setBankBalance(guildId, userId, bank - amount);
        this.add(guildId, userId, amount);
        return true;
    }
}
