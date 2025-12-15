import { EventEmitter } from "node:events";
import { SevenClient } from "../core/SevenClient";

export class EventManager extends EventEmitter {
    private client: SevenClient;

    constructor(client: SevenClient) {
        super();
        this.client = client;
    }

    public emitCustom(event: string, ...args: any[]) {
        this.emit(event, ...args);
    }
}
