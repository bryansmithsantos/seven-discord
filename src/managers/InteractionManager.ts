
import { VariableManager } from "./VariableManager";

export class InteractionManager {
    private vars: VariableManager;
    private memoryCache: Map<string, string> = new Map(); // Fast RAM Cache

    constructor(vars: VariableManager) {
        this.vars = vars;
    }

    /**
     * Register a temporary interaction handler code.
     * Uses RAM for speed, falls back to DB if needed (conceptually, but here we prioritize RAM).
     */
    public registerCode(customId: string, code: string) {
        this.memoryCache.set(customId, code);
        // Optional: Persist to DB if critical, but usually these are ephemeral
        // this.vars.set(`int_code_${customId}`, code, "global"); 
    }

    /**
     * Retrieve handler code for a custom ID.
     */
    public getCode(customId: string): string | undefined {
        // Check RAM first
        if (this.memoryCache.has(customId)) {
            return this.memoryCache.get(customId);
        }

        // Fallback or Legacy check (if utilizing var manager)
        return this.vars.get(`int_code_${customId}`, "global");
    }

    /**
     * Remove a handler
     */
    public removeCode(customId: string) {
        this.memoryCache.delete(customId);
        // this.vars.delete(`int_code_${customId}`, "global");
    }
}
