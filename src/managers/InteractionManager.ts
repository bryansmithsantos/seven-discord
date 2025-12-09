
import { VariableManager } from "./VariableManager";

export class InteractionManager {
    private vars: VariableManager;

    constructor(vars: VariableManager) {
        this.vars = vars;
    }

    public registerCode(customId: string, code: string) {
        this.vars.set(`int_code_${customId}`, code, "global");
    }

    public getCode(customId: string): string | undefined {
        return this.vars.get(`int_code_${customId}`, "global");
    }
}
