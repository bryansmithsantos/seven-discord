
import { SevenDB } from "../structures/SevenDB";
import { Logger } from "../util/Logger";

export class VariableManager {
    private db: SevenDB;

    constructor(db: SevenDB) {
        this.db = db;
    }

    /**
     * Set a variable.
     * key: Variable Name
     * value: Value
     * type: "global" | "guild" | "user" (default: global)
     * id: ID of guild or user (optional if global)
     */
    public set(name: string, value: any, type: string = "global", id: string = "0") {
        const dbKey = `var_${name}_${type}_${id}`;
        this.db.set(dbKey, value);
    }

    public get(name: string, type: string = "global", id: string = "0"): any {
        const dbKey = `var_${name}_${type}_${id}`;
        return this.db.get(dbKey);
    }

    public delete(name: string, type: string = "global", id: string = "0") {
        const dbKey = `var_${name}_${type}_${id}`;
        this.db.delete(dbKey);
    }
}
