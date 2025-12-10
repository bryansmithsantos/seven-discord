
import { Event } from "../../structures/Event";
import { Logger } from "../../util/Logger";
import { SevenClient } from "../../core/SevenClient";

export class ChannelUpdateEvent extends Event {
    constructor() { super({ name: "CHANNEL_UPDATE" }); }
    async execute(client: SevenClient, d: any) { Logger.debug(`Channel Updated: ${d.name}`); }
}
