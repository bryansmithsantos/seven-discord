
import { SevenClient } from "../core/SevenClient";

export interface EventOptions {
    name: string;
    once?: boolean;
}

export abstract class Event {
    public name: string = "";
    public once: boolean = false;

    constructor(options?: EventOptions) {
        if (options) {
            this.name = options.name;
            this.once = options.once || false;
        }
    }

    abstract execute(client: SevenClient, ...args: any[]): Promise<void> | void;
}
