
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class MessageDeleteEvent extends Event {
    constructor() { super({ name: "MESSAGE_DELETE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Message Deleted: ${d.id}`); }
}
