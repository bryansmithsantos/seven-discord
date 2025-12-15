
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

    // --- INVENTORY SYSTEM ---

    public getShopKey(guildId: string): string {
        return `eco_shop_${guildId}`;
    }

    public getInvKey(guildId: string, userId: string): string {
        return `eco_inv_${guildId}_${userId}`;
    }

    public getShop(guildId: string): any[] {
        return this.vars.get(this.getShopKey(guildId), "global") || [];
    }

    public addToShop(guildId: string, item: { name: string, price: number, id: string, icon?: string }) {
        const shop = this.getShop(guildId);
        shop.push(item);
        this.vars.set(this.getShopKey(guildId), shop, "global");
    }

    public getInventory(guildId: string, userId: string): any[] {
        return this.vars.get(this.getInvKey(guildId, userId), "global") || [];
    }

    public addItemToInventory(guildId: string, userId: string, itemId: string, amount: number = 1) {
        let inv = this.getInventory(guildId, userId);
        const existing = inv.find((i: any) => i.id === itemId);

        if (existing) {
            existing.amount += amount;
            if (existing.amount <= 0) {
                inv = inv.filter((i: any) => i.id !== itemId);
            }
        } else if (amount > 0) {
            inv.push({ id: itemId, amount: amount });
        }
        this.vars.set(this.getInvKey(guildId, userId), inv, "global");
    }

    public buyItem(guildId: string, userId: string, itemNameOrId: string): string {
        const shop = this.getShop(guildId);
        const item = shop.find((i: any) => i.id.toLowerCase() === itemNameOrId.toLowerCase() || i.name.toLowerCase() === itemNameOrId.toLowerCase());

        if (!item) return "Item not found";

        const bal = this.getBalance(guildId, userId);
        if (bal < item.price) return "Insufficient funds";

        this.remove(guildId, userId, item.price);
        this.addItemToInventory(guildId, userId, item.id, 1);
        return "true";
    }

    public sellItem(guildId: string, userId: string, itemNameOrId: string): string {
        const inv = this.getInventory(guildId, userId);
        const userItem = inv.find((i: any) => i.id.toLowerCase() === itemNameOrId.toLowerCase());

        if (!userItem) return "Item not found in inventory";

        // Find price in shop to determine sell value (half price?)
        const shop = this.getShop(guildId);
        const shopItem = shop.find((i: any) => i.id === userItem.id);
        const price = shopItem ? Math.floor(shopItem.price / 2) : 0;

        this.addItemToInventory(guildId, userId, userItem.id, -1);
        this.add(guildId, userId, price);
        return "true";
    }
}
