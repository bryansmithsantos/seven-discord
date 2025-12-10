
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class MessageUpdateEvent extends Event {
    constructor() { super({ name: "MESSAGE_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Message Updated: ${d.id}`); }
}
